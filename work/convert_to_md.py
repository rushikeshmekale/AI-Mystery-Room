from docx import Document
from pathlib import Path
from docx.oxml.ns import qn
src=Path(r'C:\Users\rushi\Documents\Codex\2026-10-26\i-x20\outputs\ai_mystery_room_spec.docx')
out=Path(r'C:\Users\rushi\Documents\Codex\2026-10-26\i-x20\outputs\AI_MYSTERY_ROOM_SPEC.md')
doc=Document(src)
parts=[]
# Walk body in document order, preserving tables among paragraphs.
body=doc._element.body
from docx.text.paragraph import Paragraph
from docx.table import Table
for child in body.iterchildren():
 if child.tag==qn('w:p'):
  para=Paragraph(child,doc); text=para.text.strip()
  if not text: continue
  style=para.style.name if para.style else ''
  if style=='Title': parts.append('# '+text)
  elif style.startswith('Heading '): parts.append('#'*(int(style.split()[-1])+1)+' '+text)
  elif style.startswith('List Bullet'): parts.append('- '+text)
  elif style.startswith('List Number'): parts.append('1. '+text)
  elif style=='Caption': continue
  else: parts.append(text)
 elif child.tag==qn('w:tbl'):
  t=Table(child,doc)
  rows=[[c.text.replace('\n',' / ').strip().replace('|','\\|') for c in row.cells] for row in t.rows]
  if not rows: continue
  parts.append('| '+' | '.join(rows[0])+' |')
  parts.append('| '+' | '.join(['---']*len(rows[0]))+' |')
  for row in rows[1:]: parts.append('| '+' | '.join(row)+' |')
  parts.append('')
out.write_text('\n\n'.join(parts)+'\n',encoding='utf-8')
src.unlink()
print(out)
