const child_process = require('child_process');
const os = require('os');

module.exports = {
  name: 'pod-install',
  factory() {
    if (os.platform() === "win32") {
      return {};
    }
    return {
      hooks: {
        afterAllInstalled(project, options) {
          if (process.env.POD_INSTALL === '0') {
            return;
          }

          if (
            options &&
            (options.mode === 'update-lockfile' ||
              options.mode === 'skip-build')
          ) {
            return;
          }

          const result = child_process.spawnSync('yarn', ['pod-install'], {
            cwd: project.cwd,
            env: process.env,
            stdio: 'inherit',
            encoding: 'utf-8',
            shell: true,
          });

          if (result.status !== 0) {
            throw new Error('Failed to run pod-install');
          }
        },
      },
    };
  },
};
