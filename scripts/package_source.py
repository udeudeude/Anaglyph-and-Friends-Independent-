"""Create corresponding application source, excluding private runtime state."""
from pathlib import Path
import sys,zipfile
root=Path(__file__).resolve().parents[1]
target=Path(sys.argv[1] if len(sys.argv)>1 else root/'build/application-source.zip')
target.parent.mkdir(parents=True,exist_ok=True)
excluded={'.git','node_modules','dist','build','artifacts','resources','ai_models','__pycache__','.preview-deps'}
with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as archive:
 for path in sorted(root.rglob('*')):
  rel=path.relative_to(root)
  if path.is_file() and not any(x in excluded for x in rel.parts) and path.name not in ('.env','application-source.zip') and path.suffix not in ('.pyc',):archive.write(path,rel)
print(target)
