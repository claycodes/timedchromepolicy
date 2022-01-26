# Chrome Timed Policies

This project is intended to display the source code for Timed Chrome Policies. It can be used as an addon to trigger chrome policy changes by orgunit at specific times. It will also generate the relevant GAM commands. 

To use this repo:

clone the repository
```
git clone <repo> <directory>
```

navigate to the installation directory

install clasp if you haven't yet.
```
npm install @google/clasp -g
clasp login
```

create the .firebasesrc 
```
{
  "projects": {
    "default": "<your firebase project id>"
  }
}
```

install the npm packages
```
npm i
```

create a google sheet in your drive and open the script editor
create the .clasp.json file with your document information
```
{"scriptId":"<your script id","rootDir":"deploy/build",
"parentId":["<your sheet id>"]}
```

navigate to the angular project directory and install the npm packages
```
cd client/timedchromepolicy
npm i 
```

enter your project id in the client/timedchromepolicy/src/environments files.

build and deploy
```
gulp build
gulp deploy
```

Connect your appscript to GCP and enable all the apis 
[Chrome Policy API](https://console.cloud.google.com/apis/api/chromepolicy.googleapis.com/overview)
[Admin SDK API](https://console.cloud.google.com/apis/api/admin.googleapis.com/overview)
[Cloud Run API](https://console.cloud.google.com/apis/api/runtimeconfig.googleapis.com/overview)


## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for details.

## License

Apache 2.0; see [`LICENSE`](LICENSE) for details.

## Disclaimer

This project is not an official Google project. It is not supported by
Google and Google specifically disclaims all warranties as to its quality,
merchantability, or fitness for a particular purpose.