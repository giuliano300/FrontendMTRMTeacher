# WAMAN MTRM teacher portal

Separate Angular frontend for the original WAMAN teachers. English interface, WAMAN palette, routed pages and page-specific styles.

## Local development

```powershell
npm ci
node node_modules/@angular/cli/bin/ng.js serve --host 127.0.0.1 --port 4202
```

API: http://127.0.0.1:5158/api. Start BackendMTRM first.

An administrator must enable Teachers > Portal access and set the teacher's password. No demo account is automatically created. The portal shows the signed-in teacher's real assigned sessions and rosters, attendance, learning materials and contact profile. Workers cannot be edited or deleted.

```powershell
npm run build
```

The API URL is configured in src/app/core/auth.service.ts. See BackendMTRM/README.md for the shared-database architecture and release limitations.
"# FrontendMTRMTeacher" 
