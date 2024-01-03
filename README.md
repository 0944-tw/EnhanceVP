# EnhanceVP
A JavaScript Code That Improve VistaPanel Page

[<kbd> <br> Install as Userscript <br> </kbd>][dist/main.user.js]

[<kbd> <br> Get Lateset <br> </kbd>][dist/main/user.js]
## Features
- CNAME --> DNS
- Domains,Subdomain,Parked --> Domains (WIP)
- PHP Info (WIP)
- PHP Configuration Editor


## Build this project
```sh
npm install
```
```sh
webpack
```
## Release
Use at `dist/main.user.js`
# vp.js
vp.js is a library could control vistapanel by js in browser

### DNS
## vpapi.`<record type>`.`add/remove/list`
### mx
- add (`domain`,`priority`,`data`)
- remove(`domain`,`priority`,`data`)
- list()
### spf
- domains()
- list()
- add(`domain`,`spfdata`)
- remove(`remove`,`spfdata`)
### cname
- list()
- add(`domain`,`destination`)
- remove(`domain`)
