module.exports = {  
    BASE_URL : 'http://localhost:3000', 
    JWT : 'key_jwt',
    JWT_EX : 24*60*60*7300, 
    PARSER : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTYzMTI2NzA3MiwiZXhwIjoyMjYxOTg3MDcyfQ.rxmC-yh4QBcXxZ0Lhl64MKiyneUUDSV3_xmKHdhB1RI",
    DATA_BASE : {
        host : "db4free.net",
        user : "sql11435912",
        database: 'sql11435912',
        password : 'w6gQCsivcu',
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