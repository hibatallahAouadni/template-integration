var gulp = require('gulp');
var bump = require('gulp-bump');
var shell = require('gulp-shell');
var runSequence = require('run-sequence');
var pckg = require('./package.json');
var util = require('gulp-util');
var sonarqubeScanner = require('sonarqube-scanner'),
    request = require('ajax-request'),
    sleep = require('sleep'),
    os = require('os');
const project_key = 'template-integration' + "." + process.env.DEV_USERNAME;
const project_name = "template-integration : " + " " + process.env.DEV_USERNAME;
const sonar_server = "http://192.168.1.161";

// fetch command line arguments
const arg = (argList => {
        let arg = {}, a, opt, thisOpt, curOpt;
for(a=0;a<argList.length;a++)thisOpt=argList[a].trim(),opt=thisOpt.replace(/^\-+/,""),opt===thisOpt?(curOpt&&(arg[curOpt]=opt),curOpt=null):(curOpt=opt,arg[curOpt]=!0);
return arg;

})(process.argv);

//Bumping version
function incrementVersion(importance) {
    return gulp.src(['./package.json','./sonar-project.properties','./README.md'])
    // bump the version number in those files
        .pipe(bump({type: importance}))
        // save it back to filesystem
        .pipe(gulp.dest('./'));
}
gulp.task('prerelease', function() { return incrementVersion('prerelease'); })
gulp.task('patch', function() { return incrementVersion('patch'); })
gulp.task('feature', function() { return incrementVersion('minor'); })
gulp.task('release', function() { return incrementVersion('major'); })

//build tasks

gulp.task('preparePackage', shell.task([
    'rm -rf template-integration.zip',
    'zip -r template-integration.zip * .htaccess',
]))

gulp.task('deleteZip', shell.task([
    'rm -f template-integration.zip',
]))

gulp.task('build', function() {
    runSequence(
        'preparePackage'
    );
});



//git tasks
function prepare(branch) {
    return gulp.src(['./'])
    // bump the version number in those files
        .pipe(shell(['git config --local credential.helper store','git checkout '+ branch]))
        // save it back to filesystem
        .pipe(gulp.dest('./'));
}
gulp.task('gitPrepare', function() { return prepare(util.env.branch); })

gulp.task('gitAdd', shell.task([
    'git add -A'
]))
gulp.task('gitCommit', shell.task([
    'git commit -m "commit_bumping_version"',
]))
gulp.task('injectEnvVariable', shell.task([
    'echo RELEASE_VERSION= '+ pckg.version+' > envVars.properties',
]))
function pushToGit(remote, branch) {
    return gulp.src(['./'])
    // bump the version number in those files
        .pipe(shell('git push '+ remote+ ' '+ branch))
        // save it back to filesystem
        .pipe(gulp.dest('./'));
}
gulp.task('gitUpdateRepository', function(callback) {
    runSequence('gitAdd',
        'gitCommit',
        function (err) {
            //if any error happened in the previous tasks, exit with a code > 0
            if (err) {
                var exitCode = 2;
                console.log('[ERROR] gulp build task failed', err);
                console.log('[FAIL] gulp build task failed - exiting with code ' + exitCode);
                return process.exit(exitCode);
            }
            else {
                //console.log(pckg.version);
                return pushToGit(util.env.remote, util.env.branch);
            }
        }
    );
});

/* Coding standard control and Quality inspection */
gulp.task('phpUnit', shell.task([
    'phpunit themes'
]));

function waitTask(){
    sleep.sleep(5)
    request({
        url: sonar_server+'/api/ce/component?component=' + project_key,
        method: 'GET',
        json: true,
        async: false
    }, function (err, res, body) {
        if(body.queue.length != 0){
            waitTask()
        }else{
            getQualityGate()
        }
    });
}

function getQualityGate(){
    request({
        url: sonar_server+'/api/qualitygates/project_status?projectKey=' + project_key,
        method: 'GET',
        json: true
    }, function (err, res, body) {
        console.log(body.projectStatus.status);
        //console.log(body[0].msr[0].data);
    });
}

function bumpVersion(str){
    var tab = str.split('.');
    return version = tab[0]+"."+tab[1]+"."+(parseInt(tab[2]) + 1);
}

gulp.task('sonar-scanner', function (callback) {
    var project_version;
    request({
        url: sonar_server+'/api/project_analyses/search?project=' + project_key,
        method: 'GET',
        json: true,
        async: false
    }, function (err, res, body) {
        try{
            if(body.analyses.length > 0){
                var previous_version;
                body.analyses[0].events.forEach(function(object){
                    if(object.category =="VERSION"){
                        previous_version = object.name;
                    }
                });
                project_version = bumpVersion(previous_version);
            }
        }catch (err){
            project_version = "99.99.0";
        }

        sonarqubeScanner({
            serverUrl: sonar_server,
            options: {
                "sonar.projectKey": project_key,
                "sonar.projectName": project_name,
                "sonar.projectVersion": project_version,
                "sonar.sources": arg.file
            }
        }, callback);
        console.log('waiting SonarQube Task');
        waitTask();
    });
});

gulp.task('performance-test', shell.task([
    'siege -r10 -c1 -f reports/siege_report/url_file.txt | grep -v  HTTP'
], {ignoreErrors: true}));

gulp.task('linting-test', shell.task([
    'php-cs-fixer fix -v themes > reports/linting_report/linting_report.log'
], {ignoreErrors: true}));

gulp.task('phpdoc', shell.task([
    'phpdoc -d src -t reports/phpdoc --template="clean" --ignore vendor/,tests/,tools/,packages/'
], {ignoreErrors: true}));

gulp.task('test-dynamic-memory', shell.task([
    'php -n dephpend.phar dsm src > reports/xdebug/dependencies.html',
    'php -n dephpend.phar text src > reports/xdebug/dependencies.txt',
    'php -n dephpend.phar metrics src > reports/xdebug/dependencies.metrics',
    'echo -n "" > /tmp/traces.12345.xt',
    'php -c php-with-traces.ini phpunit src > reports/xdebug/testunit.txt',
    'php tracefile-analyser.php /tmp/traces.12345.xt memory-own 20 > reports/xdebug/dependencies.trace',
    'php -n dephpend.phar text src --no-classes --dynamic=/tmp/traces.12345.xt > reports/xdebug/dependencies.dynamic'
], {ignoreErrors: true}));

gulp.task('dev-task-runner-v1', function () {
    runSequence(
        'sonar-scanner'
    );
});

gulp.task('dev-task-runner', function () {
    runSequence(
        'phpUnit',
        'sonar-scanner',
        'performance-test',
        'linting-test',
        'phpdoc',
        'test-dynamic-memory'
    );
});

/* End : Coding standard control and Quality inspection */