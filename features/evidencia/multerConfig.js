
var multer = require('multer');
var path = require('path');
var crypto = require('crypto');

module.exports = {
    dest: 'public/archives',
    // dest: path.resolve(__dirname, '..','tmp','archives'));
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/archives');
            // cb(null, path.resolve(__dirname, '..','tmp','archives'));
        },
        filename: function (req, file, cb) {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);
                const fileName = `${hash.toString('hex')}-${file.originalname}`;
                cb(null, fileName);
            })
            // cb(null, file.fieldname + '-' + Date.now())
        }
    }),
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowMimes = [
            //* COMPRESSED
            'application/x-7z-compressed', //.7z
            'application/x-bzip', //.bz
            'application/x-bzip2', //.bz2
            'application/x-rar-compressed', //.rar
            'application/x-tar', //.tar
            'application/zip', //.zip
            //* PDF
            'application/pdf',
            //* MS-OFFICE
            'application/vnd.ms-excel', //xls
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', //.xlsx
            'application/vnd.ms-powerpoint', //.ppt
            'application/msword', //.doc
            //* OPEN OFFICE
            'application/vnd.oasis.opendocument.presentation', //.odp
            'application/vnd.oasis.opendocument.spreadsheet', //.ods
            'application/vnd.oasis.opendocument.text', //.odt
            //* IMAGES
            'image/jpeg', //.jpeg|.jpg
            'image/png',
            'image/gif',
            'image/svg+xml',
            //* TEXT
            'text/csv', //.csv
            'text/html', //.htm|.html
            'text/plain', //.txt|... qualquerArquivoNaoBinario
        ]

        if (allowMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type"));
        }
    }
}