module.exports = {  
    JWT : 'key_jwt',
    JWT_EX : 8*60*60, 
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