
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  grunt.registerTask('default', function() {
    /**
    asset task
    -> create build directory
    -> copy index-release.html to build as index.html
    -> copy bundle.min.js to build
    -> app/**.html to build
    -> app/**.css to build
    **/

    var directories = [
      'build',
      'node_modules',
      'node_modules/zone.js',
      'node_modules/zone.js/dist',
      'node_modules/reflect-metadata',
      'node_modules/material-design-icons',
      'node_modules/material-design-icons/iconfont',
      'node_modules/bootstrap',
      'node_modules/bootstrap/dist',
      'node_modules/bootstrap/dist/css',
      'node_modules/bootstrap/dist/fonts',
      'node_modules/bootstrap-material-design',
      'node_modules/bootstrap-material-design/dist',
      'node_modules/bootstrap-material-design/dist/css',
      'build/app',
      'build/app/archive.component',
      'build/app/incident.component',
      'build/app/maintenance.component',
      'build/app/supply.component',
      'build/app/vehicle.component',
    ];

    directories.forEach(
      (path) => {
        if(!grunt.file.exists(path)) {
          grunt.log.ok(`creating ${path} directory`);
          grunt.file.mkdir(path);
        }
      }
    );

    var install = [
      ['index-release.html', 'build/index.html'],
      ['styles.css', 'build/styles.css'],
      ['bundle.min.js', 'build/bundle.min.js'],
      ['app/app.component.html', 'build/app/app.component.html'],
      ['app/dashboard.component.html', 'build/app/dashboard.component.html'],
      ['app/modal-loading.component.html', 'build/app/modal-loading.component.html'],
      ['app/modal-loading.component.css', 'build/app/modal-loading.component.css'],
      ['app/archive.component/detail.html', 'build/app/archive.component/detail.html'],
      ['app/archive.component/form.html', 'build/app/archive.component/form.html'],
      ['app/archive.component/list.html', 'build/app/archive.component/list.html'],
      ['app/incident.component/detail.html', 'build/app/incident.component/detail.html'],
      ['app/incident.component/form.html', 'build/app/incident.component/form.html'],
      ['app/incident.component/list.html', 'build/app/incident.component/list.html'],
      ['app/maintenance.component/detail.html', 'build/app/maintenance.component/detail.html'],
      ['app/maintenance.component/form.html', 'build/app/maintenance.component/form.html'],
      ['app/maintenance.component/list.html', 'build/app/maintenance.component/list.html'],
      ['app/supply.component/detail.html', 'build/app/supply.component/detail.html'],
      ['app/supply.component/form.html', 'build/app/supply.component/form.html'],
      ['app/supply.component/list.html', 'build/app/supply.component/list.html'],
      ['app/vehicle.component/detail.html', 'build/app/vehicle.component/detail.html'],
      ['app/vehicle.component/form.html', 'build/app/vehicle.component/form.html'],
      ['app/vehicle.component/dashboard.html', 'build/app/vehicle.component/dashboard.html'],
      ['node_modules/bootstrap/dist/css/bootstrap.min.css', 'build/node_modules/bootstrap/dist/css/bootstrap.min.css'],
      ['node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.eot', 'build/node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.eot'],
      ['node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.svg', 'build/node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.svg'],
      ['node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf', 'build/node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf'],
      ['node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.woff', 'build/node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.woff'],
      ['node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2', 'build/node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2'],
      ['node_modules/bootstrap-material-design/dist/css/bootstrap-material-design.min.css', 'build/node_modules/bootstrap-material-design/dist/css/bootstrap-material-design.min.css'],
      ['node_modules/bootstrap-material-design/dist/css/ripples.min.css', 'build/node_modules/bootstrap-material-design/dist/css/ripples.min.css'],
      ['node_modules/material-design-icons/iconfont/material-icons.css', 'build/node_modules/material-design-icons/iconfont/material-icons.css'],
      ['node_modules/material-design-icons/iconfont/MaterialIcons-Regular.eot', 'build/node_modules/material-design-icons/iconfont/MaterialIcons-Regular.eot'],
      ['node_modules/material-design-icons/iconfont/MaterialIcons-Regular.ijmap', 'build/node_modules/material-design-icons/iconfont/MaterialIcons-Regular.ijmap'],
      ['node_modules/material-design-icons/iconfont/MaterialIcons-Regular.svg', 'build/node_modules/material-design-icons/iconfont/MaterialIcons-Regular.svg'],
      ['node_modules/material-design-icons/iconfont/MaterialIcons-Regular.ttf', 'build/node_modules/material-design-icons/iconfont/MaterialIcons-Regular.ttf'],
      ['node_modules/material-design-icons/iconfont/MaterialIcons-Regular.woff', 'build/node_modules/material-design-icons/iconfont/MaterialIcons-Regular.woff'],
      ['node_modules/material-design-icons/iconfont/MaterialIcons-Regular.woff2', 'build/node_modules/material-design-icons/iconfont/MaterialIcons-Regular.woff2'],
      ['node_modules/zone.js/dist/zone.js', 'build/node_modules/zone.js/dist/zone.js'],
      ['node_modules/reflect-metadata/Reflect.js', 'build/node_modules/reflect-metadata/Reflect.js'],
    ];

    install.forEach(
      (info) => {
        var src, dst;
        src = info[0];
        dst = info[1];

        grunt.log.ok(`copy from ${src} to ${dst}`);
        grunt.file.copy(src, dst);
      }
    );
  });

};
