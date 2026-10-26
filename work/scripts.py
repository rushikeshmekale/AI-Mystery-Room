import json
from pathlib import Path
p=Path('package.json'); d=json.loads(p.read_text(encoding='utf-8-sig'))
d['scripts']={'dev':'concurrently -k "npm:dev:server" "npm:dev:client"','dev:client':'cd client && npm run dev','dev:server':'cd server && npm run dev','build':'cd client && npm run build','start':'cd server && npm start'}
p.write_text(json.dumps(d,indent=2)+'\n',encoding='utf-8')
