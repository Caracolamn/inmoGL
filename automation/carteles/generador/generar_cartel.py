#!/usr/bin/env python3
"""Genera una copia de cartel Scribus sin alterar su diseño protegido.

Solo modifica el contenido CH de los campos de texto autorizados y, en las
dos fotografías, el archivo, escala y desplazamiento internos necesarios para
un recorte proporcional centrado tipo "cover".
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import struct
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Iterable
from xml.sax.saxutils import quoteattr


TEXT_FIELDS = (
    "TIPO_INMUEBLE",
    "DIRECCION",
    "LOCALIDAD",
    "RESUMEN_INMUEBLE",
    "HABITACIONES",
    "BANOS",
    "M2_CONSTRUIDOS",
    "PRECIO",
)
PHOTO_FIELDS = ("FOTO_01", "FOTO_02")
ALL_VARIABLE_FIELDS = set(TEXT_FIELDS) | set(PHOTO_FIELDS)
PHOTO_MUTABLE_ATTRS = {
    "PFILE",
    "LOCALSCX",
    "LOCALSCY",
    "LOCALX",
    "LOCALY",
    "SCALETYPE",
    "RATIO",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Genera un cartel InmoGL desde una plantilla Scribus bloqueada."
    )
    parser.add_argument("--plantilla", required=True, type=Path)
    parser.add_argument("--datos", required=True, type=Path)
    parser.add_argument("--fotos-dir", required=True, type=Path)
    parser.add_argument("--salida", required=True, type=Path)
    parser.add_argument("--informe", type=Path)
    return parser.parse_args()


def object_by_name(root: ET.Element, name: str) -> ET.Element:
    matches = [obj for obj in root.iter() if obj.get("ANNAME") == name]
    if len(matches) != 1:
        raise ValueError(
            f"La plantilla debe contener exactamente un objeto {name}; encontrados: {len(matches)}"
        )
    return matches[0]


def parse_xml(text: str) -> ET.Element:
    return ET.fromstring(text)


def replace_attribute(tag: str, attr: str, value: str) -> str:
    pattern = re.compile(rf'(\s{re.escape(attr)}=)(["\']).*?\2', re.S)
    encoded = quoteattr(str(value))
    if pattern.search(tag):
        return pattern.sub(lambda match: match.group(1) + encoded, tag, count=1)
    return tag[:-1] + f" {attr}={encoded}>"


def object_block_pattern(name: str) -> re.Pattern[str]:
    return re.compile(
        rf'(<PAGEOBJECT\b(?=[^>]*\bANNAME="{re.escape(name)}")[^>]*>)(.*?)(</PAGEOBJECT>)',
        re.S,
    )


def set_text_value(document: str, name: str, value: str) -> str:
    pattern = object_block_pattern(name)
    match = pattern.search(document)
    if not match:
        raise ValueError(f"No se encontró el cuadro de texto {name}")

    body = match.group(2)
    tags = list(re.finditer(r"<ITEXT\b[^>]*>", body, re.S))
    if not tags:
        raise ValueError(f"El cuadro {name} no contiene nodos ITEXT")

    # La plantilla aprobada usa dos estilos en TIPO_INMUEBLE. Se mantienen
    # ambos nodos: el primero recibe la inicial y el segundo el resto.
    if name == "TIPO_INMUEBLE" and len(tags) >= 2:
        chunks = [value[:1], value[1:]] + [""] * (len(tags) - 2)
    else:
        chunks = [value] + [""] * (len(tags) - 1)

    rebuilt: list[str] = []
    cursor = 0
    for tag_match, chunk in zip(tags, chunks):
        rebuilt.append(body[cursor : tag_match.start()])
        rebuilt.append(replace_attribute(tag_match.group(0), "CH", chunk))
        cursor = tag_match.end()
    rebuilt.append(body[cursor:])
    new_body = "".join(rebuilt)
    return document[: match.start()] + match.group(1) + new_body + match.group(3) + document[match.end() :]


def set_photo_attributes(document: str, name: str, attrs: dict[str, str]) -> str:
    pattern = re.compile(
        rf'<PAGEOBJECT\b(?=[^>]*\bANNAME="{re.escape(name)}")[^>]*/>', re.S
    )
    match = pattern.search(document)
    if not match:
        raise ValueError(f"No se encontró el marco de imagen {name}")
    tag = match.group(0)
    for key, value in attrs.items():
        tag = replace_attribute(tag, key, value)
    return document[: match.start()] + tag + document[match.end() :]


def image_size(path: Path) -> tuple[int, int]:
    try:
        from PIL import Image

        with Image.open(path) as image:
            return image.size
    except ImportError:
        pass

    # Respaldo sin dependencias para WebP VP8/VP8L/VP8X.
    raw = path.read_bytes()
    if raw[:4] != b"RIFF" or raw[8:12] != b"WEBP":
        raise RuntimeError(
            "Instala Pillow (python3 -m pip install Pillow) para leer este formato de imagen."
        )
    chunk = raw[12:16]
    if chunk == b"VP8X":
        width = 1 + int.from_bytes(raw[24:27], "little")
        height = 1 + int.from_bytes(raw[27:30], "little")
        return width, height
    if chunk == b"VP8 ":
        marker = raw.find(b"\x9d\x01\x2a", 20)
        if marker < 0:
            raise RuntimeError(f"No se pudo leer el tamaño de {path}")
        width, height = struct.unpack_from("<HH", raw, marker + 3)
        return width & 0x3FFF, height & 0x3FFF
    if chunk == b"VP8L":
        bits = int.from_bytes(raw[21:25], "little")
        return (bits & 0x3FFF) + 1, ((bits >> 14) & 0x3FFF) + 1
    raise RuntimeError(f"Variante WebP no reconocida: {path}")


def cover_values(frame_width: float, frame_height: float, image_width: int, image_height: int) -> dict[str, str]:
    """Devuelve escala y desplazamiento para llenar el marco sin deformar."""
    def number(value: float) -> str:
        if abs(value) < 1e-10:
            return "0"
        return f"{value:.12f}".rstrip("0").rstrip(".")

    scale = max(frame_width / image_width, frame_height / image_height)
    visible_width = frame_width / scale
    visible_height = frame_height / scale
    offset_x = -(image_width - visible_width) / 2.0
    offset_y = -(image_height - visible_height) / 2.0
    return {
        "LOCALSCX": number(scale),
        "LOCALSCY": number(scale),
        "LOCALX": number(offset_x),
        "LOCALY": number(offset_y),
        "SCALETYPE": "1",
        "RATIO": "1",
    }


def normalized_element(element: ET.Element, *, variable_name: str | None = None) -> tuple:
    attrs = dict(element.attrib)
    if variable_name in PHOTO_FIELDS:
        for attr in PHOTO_MUTABLE_ATTRS:
            attrs.pop(attr, None)
    if variable_name in TEXT_FIELDS and element.tag == "ITEXT":
        attrs.pop("CH", None)
    children = tuple(
        normalized_element(child, variable_name=variable_name) for child in list(element)
    )
    return element.tag, tuple(sorted(attrs.items())), (element.text or "").strip(), children


def validate_integrity(before: ET.Element, after: ET.Element) -> list[str]:
    messages: list[str] = []

    before_named = {
        obj.get("ANNAME"): obj
        for obj in before.iter()
        if obj.tag in {"PAGEOBJECT", "MASTEROBJECT"} and obj.get("ANNAME")
    }
    after_named = {
        obj.get("ANNAME"): obj
        for obj in after.iter()
        if obj.tag in {"PAGEOBJECT", "MASTEROBJECT"} and obj.get("ANNAME")
    }
    if before_named.keys() != after_named.keys():
        raise AssertionError("Cambió el conjunto de objetos nombrados de la plantilla")

    for name, original in before_named.items():
        generated = after_named[name]
        variable_name = name if name in ALL_VARIABLE_FIELDS else None
        if normalized_element(original, variable_name=variable_name) != normalized_element(
            generated, variable_name=variable_name
        ):
            raise AssertionError(f"El generador alteró propiedades protegidas del objeto {name}")

    original_master = [normalized_element(obj) for obj in before.iter("MASTEROBJECT")]
    generated_master = [normalized_element(obj) for obj in after.iter("MASTEROBJECT")]
    if original_master != generated_master:
        raise AssertionError("Se alteró algún elemento del maestro visual")

    for field in ALL_VARIABLE_FIELDS:
        item = object_by_name(after, field)
        if item.get("LOCK") != "1" or item.get("LOCKR") != "1":
            raise AssertionError(f"El campo {field} perdió alguno de sus dos bloqueos")

    messages.append("OK — maestro visual sin cambios")
    messages.append("OK — geometría, estilos, capas y bloqueos sin cambios")
    messages.append("OK — solo se modificaron los datos autorizados")
    messages.append("OK — las dos fotos usan recorte proporcional centrado tipo cover")
    return messages


def copy_fixed_assets(template: Path, output: Path, photo_names: Iterable[str]) -> None:
    template_assets = template.parent / "assets"
    output_assets = output.parent / "assets"
    output_assets.mkdir(parents=True, exist_ok=True)
    dynamic = set(photo_names)
    if template_assets.is_dir():
        for source in template_assets.iterdir():
            if source.is_file() and source.name not in dynamic:
                shutil.copy2(source, output_assets / source.name)


def main() -> int:
    args = parse_args()
    data = json.loads(args.datos.read_text(encoding="utf-8"))
    missing = [field for field in TEXT_FIELDS if field not in data["campos"]]
    if missing:
        raise ValueError("Faltan campos obligatorios: " + ", ".join(missing))
    if len(data.get("fotos", [])) != 2:
        raise ValueError("La prueba requiere exactamente dos fotografías")

    original_text = args.plantilla.read_text(encoding="utf-8")
    before = parse_xml(original_text)
    generated_text = original_text

    for field in TEXT_FIELDS:
        generated_text = set_text_value(generated_text, field, str(data["campos"][field]))

    output_assets = args.salida.parent / "assets"
    output_assets.mkdir(parents=True, exist_ok=True)
    photo_names: list[str] = []
    for slot, photo_info in zip(PHOTO_FIELDS, data["fotos"]):
        source = args.fotos_dir / photo_info["archivo"]
        if not source.is_file():
            raise FileNotFoundError(f"No existe la fotografía: {source}")
        photo_names.append(source.name)
        shutil.copy2(source, output_assets / source.name)

        image_width, image_height = image_size(source)
        frame = object_by_name(before, slot)
        attrs = cover_values(
            float(frame.get("WIDTH", "0")),
            float(frame.get("HEIGHT", "0")),
            image_width,
            image_height,
        )
        attrs["PFILE"] = f"assets/{source.name}"
        generated_text = set_photo_attributes(generated_text, slot, attrs)

    copy_fixed_assets(args.plantilla, args.salida, photo_names)
    after = parse_xml(generated_text)
    messages = validate_integrity(before, after)

    args.salida.parent.mkdir(parents=True, exist_ok=True)
    args.salida.write_text(generated_text, encoding="utf-8")
    report = [
        f"INMUEBLE: {data.get('id', 'sin id')}",
        f"PLANTILLA: {args.plantilla.name}",
        f"SALIDA: {args.salida.name}",
        *messages,
    ]
    report_text = "\n".join(report) + "\n"
    if args.informe:
        args.informe.parent.mkdir(parents=True, exist_ok=True)
        args.informe.write_text(report_text, encoding="utf-8")
    print(report_text, end="")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f"ERROR: {error}", file=sys.stderr)
        raise SystemExit(1)
