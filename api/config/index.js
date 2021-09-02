module.exports = {  
    BASE_URL : 'http://localhost:3000', 
    JWT : 'key_jwt',
    JWT_EX : 24*60*60*7300, 
    PARSER : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE1LCJpYXQiOjE2MzA1ODY5NDYsImV4cCI6MjI2MTMwNjk0Nn0.KRysF_WgF-8xRKPJk7s9sQ6m7xJZ2c-bEgtNxGZ9aGE",
    DATA_BASE : {
        host : "remotemysql.com",
        user : "w5X7xM9vxJ",
        database: 'w5X7xM9vxJ',
        password : 'HROLOxkqeD',
        port : 3306
    }, 
    LOG_OPTIONS : {
        timeZone: 'Europe/Kiev',
        folderPath: './logs/',
        dateBasedFileNaming: true,
        fileNamePrefix: 'Logs_',
        fileNameExtension: '.log',    
        dateFormat: 'YYYY_MM_D',
        timeFormat: 'h:mm:ss A',
    }
}