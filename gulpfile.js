// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const {series, parallel, src, dest} = require('gulp');
const exec = require('child_process').exec;
const inject = require('gulp-inject-string');
const clean = require('gulp-clean');
require('dotenv').config()

const PROJECT_NAME =process.env.PROJECT_NAME
const LOCAL_TOKEN = process.env.LOCAL_TOKEN
const APP_NAME ='timedchromepolicy'
const BASE_URL = `https://${PROJECT_NAME}.web.app`;

function defaultTask(cb) {
    cb();
}

function buildClient(cb) {
    exec('"ng" build --prod', {cwd: `./client/${APP_NAME}`}, (err, stdout, stderr) => {
        console.log(stdout);
        console.error(stderr);
        cb(err);
    });
}

function copyClientFiles(cb) {
    src([`./client/${APP_NAME}/dist/${APP_NAME}/*.js`, `./client/${APP_NAME}/dist/${APP_NAME}/*.css`])
        .pipe(dest('deploy/public/assets/scripts'));
    cb();
}

function processClientAssetFiles(cb) {
    src(`./client/${APP_NAME}/dist/${APP_NAME}/assets/**/*.*`, {allowEmpty: true})
        .pipe(dest('deploy/public/assets'));
    cb();

}

function processClientOtherFiles(cb) {
    src([`./client/${APP_NAME}/dist/${APP_NAME}/*.*`,
     `!./client/${APP_NAME}/dist/${APP_NAME}/*.html`,
      `!./client/${APP_NAME}/dist/${APP_NAME}/*.js`,
     `!./client/${APP_NAME}/dist/${APP_NAME}/*.css`])
        .pipe(dest('deploy/public/assets'));
    cb();
}

function buildClientLoadPage(cb) {
    src(`./client/${APP_NAME}/dist/${APP_NAME}/index.html`)
        .pipe(inject.after('<base href="/">', '<base target="_top">'))
        .pipe(inject.after('<link rel="stylesheet" href="', BASE_URL + '/assets/scripts/'))
        .pipe(inject.afterEach('<script src="', BASE_URL + '/assets/scripts/'))
        .pipe(inject.afterEach('</script>', '\n'))
        .pipe(dest('deploy/build/client/'));
    cb();
}

function wait(cb) {
    setTimeout(() => cb(), 3000);
}

function deployStaticAssets(cb) {
    exec(`"firebase" deploy --only hosting ${(LOCAL_TOKEN)?'--token ' + LOCAL_TOKEN : ''}`, (err, stdout, stderr) => {
        console.log(stdout);
        console.error(stderr);
        cb(err);
    });
}


function deployWebapp(cb) {
    exec('"clasp" push --force', (err, stdout, stderr) => {
        console.log(stdout);
        console.error(stderr);
        cb(err);
    });
    cb();
}

function processManifest(cb) {
    src('./server/appsscript.json').pipe(dest('deploy/build/'));
    cb();
}

function processServerFiles(cb) {
    src('./server/*.*').pipe(dest('deploy/build/server/'));
    cb();
}


function cleanBuild(cb) {
    src('deploy', {read: false, allowEmpty: true}).pipe(clean({force: true}))
    cb();
}



exports.deploy = parallel(deployStaticAssets, deployWebapp);

exports.build = series(cleanBuild, wait, processServerFiles, processManifest, buildClient,
    copyClientFiles, processClientAssetFiles, processClientOtherFiles, buildClientLoadPage);

exports.deploy_server = series(cleanBuild, wait, processServerFiles, processManifest, deployWebapp );