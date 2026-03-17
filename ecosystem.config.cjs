module.exports = {
  apps: [
    {
      name: 'foodrush-backend',
      script: 'python3',
      args: 'manage.py runserver 0.0.0.0:8000',
      cwd: '/home/user/foodrush',
      env: { PYTHONUNBUFFERED: '1', DJANGO_SETTINGS_MODULE: 'core.settings' },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
    },
    {
      name: 'foodrush-frontend',
      script: '/home/user/foodrush/start_frontend.sh',
      cwd: '/home/user/foodrush-frontend',
      env: {
        PORT: '3000',
        BROWSER: 'none',
        CI: 'false',
        DANGEROUSLY_DISABLE_HOST_CHECK: 'true',
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
    },
  ],
};
