module.exports = {
    apps : [{
      name: "app",
      script: "./bin/www",
      error_file : "/Users/yuha/Desktop/discoer/logs/error-log/err.log",
      out_file : "/Users/yuha/Desktop/discoer/logs/log/out.log",
      log_date_format: "YYYY-MM-DD HH:mm"
    }]
  }

//환경변수 파일로 pm2 실행
//$ pm2 start ecosystem.config.js