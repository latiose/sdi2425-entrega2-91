const {ObjectId} = require("mongodb");
const crypto = require('crypto');

module.exports = async function initializeDatabase(client) {
    try {
        await client.connect();

        const db = client.db();
        const logsCollection = db.collection("logs");
        await logsCollection.deleteMany({});

        const usersCollection = db.collection("users");
        await usersCollection.deleteMany({});

        const clave = "abcdefg";
        const letrasDni = "TRWAGMYFPDXBNJZSQVHLCKE";

        function calcularLetraDNI(numero) {
            return letrasDni[numero % 23];
        }

        function hashPassword(password, clave) {
            return crypto.createHmac('sha256', clave).update(password).digest('hex');
        }
        const adminId = new ObjectId();
        const users = [
            {
                _id: adminId,
                dni: "12345678Z",
                password: hashPassword("@Dm1n1str@D0r", clave),
                role: "ADMIN"
            }
        ];

        for (let i = 1; i <= 15; i++) {
            const numDni = 10000000 + i;
            const letra = calcularLetraDNI(numDni);
            const dni = `${numDni}${letra}`;
            const plainPassword = `Us3r@${i}-PASSW`;
            const user = {
                _id: new ObjectId(),
                dni: dni,
                password: hashPassword(plainPassword, clave),
                role: "EMPLOYEE"
            };
            users.push(user);
        }


        await usersCollection.insertMany(users);

        const vehiclesCollection = db.collection("vehicles");
        await vehiclesCollection.deleteMany({});
        await vehiclesCollection.insertMany([
            {
                "_id": new ObjectId("67f78bfbeb4480ef31b369f4"),  // Matches vehicle "1234BCD"
                "numberPlate": "1234BCD",
                "vin": "ASDFGHJKLQWERTYUA",
                "brand": "Mercedes",
                "model": "Clase A",
                "fuelType": "Diesel",
                "mileage": 0,
                "status": "LIBRE"
            },
            {
                "_id": new ObjectId("67f78c358c8c58e3e50db186"),
                "numberPlate": "4567CRD",
                "vin": "WDBUF56X68B123456",
                "brand": "BMW",
                "model": "Serie 3",
                "fuelType": "Gasolina",
                "mileage": 15234,
                "status": "LIBRE"
            },
            {
                "_id": new ObjectId("67f78c358c8c58e3e50db187"),
                "numberPlate": "B1234AZ",
                "vin": "1HGCM82633A654321",
                "brand": "Audi",
                "model": "A4",
                "fuelType": "Diesel",
                "mileage": 43567,
                "status": "LIBRE"
            },
            {
                "_id": new ObjectId("67f78c358c8c58e3e50db189"),
                "numberPlate": "M7643BC",
                "vin": "JHMFA36296S789654",
                "brand": "Ford",
                "model": "Focus",
                "fuelType": "GNL",
                "mileage": 89000,
                "status": "LIBRE"
            },
            {
                "_id": new ObjectId("67f78c358c8c58e3e50db18a"),
                "numberPlate": "1023LSK",
                "vin": "5YJRE1A31A1237890",
                "brand": "Tesla",
                "model": "Model 3",
                "fuelType": "Eléctrico",
                "mileage": 23000,
                "status": "LIBRE"
            },
            {
                "_id": new ObjectId("67f78c358c8c58e3e50db18b"),
                "numberPlate": "C4567ER",
                "vin": "2T1BURHE6GC564321",
                "brand": "Hyundai",
                "model": "i30",
                "fuelType": "Microhíbrido",
                "mileage": 5000,
                "status": "LIBRE"
            },
            {
                "_id": new ObjectId("67f78c358c8c58e3e50db18c"),
                "numberPlate": "6543NRG",
                "vin": "1FTWW33P56ED78901",
                "brand": "Nissan",
                "model": "Qashqai",
                "fuelType": "GLP",
                "mileage": 45000,
                "status": "LIBRE"
            },
            {
                "_id": new ObjectId("67f78c358c8c58e3e50db18e"),
                "numberPlate": "7812DHL",
                "vin": "WAUZZZ8K5AA123456",
                "brand": "Volkswagen",
                "model": "Golf",
                "fuelType": "Híbrido",
                "mileage": 67000,
                "status": "LIBRE"
            },
            {
                "numberPlate": "T9321MJ",
                "vin": "1GNEK13Z64R987654",
                "brand": "Kia",
                "model": "Ceed",
                "fuelType": "Diesel",
                "mileage": 22000,
                "status": "LIBRE"
            },
            {
                "numberPlate": "3812SRQ",
                "vin": "2HGFG12898H345678",
                "brand": "Renault",
                "model": "Clio",
                "fuelType": "Gasolina",
                "mileage": 1200,
                "status": "LIBRE"
            },
            {
                "numberPlate": "D1873PU",
                "vin": "WVWZZZ1KZAW123456",
                "brand": "Seat",
                "model": "Ibiza",
                "fuelType": "Diesel",
                "mileage": 39800,
                "status": "LIBRE"
            },
            {
                "numberPlate": "7045VCK",
                "vin": "JM1BK32F281234567",
                "brand": "Mazda",
                "model": "3",
                "fuelType": "Híbrido",
                "mileage": 31200,
                "status": "LIBRE"
            },
            {
                "numberPlate": "F3842KT",
                "vin": "3VWFE21C04M456789",
                "brand": "Citroën",
                "model": "C4",
                "fuelType": "GNL",
                "mileage": 48000,
                "status": "LIBRE"
            },
            {
                "numberPlate": "1894MPQ",
                "vin": "1N4AL11D75C987654",
                "brand": "Skoda",
                "model": "Fabia",
                "fuelType": "Microhíbrido",
                "mileage": 25100,
                "status": "LIBRE"
            },
            {
                "numberPlate": "P0981LK",
                "vin": "5N1AR18W96C345678",
                "brand": "Opel",
                "model": "Astra",
                "fuelType": "GLP",
                "mileage": 147000,
                "status": "LIBRE"
            },
            {
                "numberPlate": "Q3495ZX",
                "vin": "JN8AZ1MW6AW123456",
                "brand": "Honda",
                "model": "Civic",
                "fuelType": "Gasolina",
                "mileage": 42000,
                "status": "LIBRE"
            },
            {
                "numberPlate": "S8123GN",
                "vin": "1C4RJFAG6CC123456",
                "brand": "Fiat",
                "model": "Punto",
                "fuelType": "Diesel",
                "mileage": 71500,
                "status": "LIBRE"
            },
            {
                "numberPlate": "M7342DB",
                "vin": "3N1AB7AP0HY234567",
                "brand": "Dacia",
                "model": "Duster",
                "fuelType": "Eléctrico",
                "mileage": 10300,
                "status": "LIBRE"
            },
            {
                "numberPlate": "9871TGB",
                "vin": "JH4KA9650MC345678",
                "brand": "Lexus",
                "model": "UX 250h",
                "fuelType": "Híbrido",
                "mileage": 16000,
                "status": "OCUPADO"
            }
        ]);


        const journeysCollection = db.collection("journeys");
        await journeysCollection.deleteMany({});
        await journeysCollection.insertMany([
            {
                "startDate": new Date("2025-04-12T23:28:00.331916Z"),
                "odometerStart": 96267,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db18c"),
                "vehiclePlate": "6543NRG",
                "employeeId": "67f2c812ed40ed1fc1b2fa2b",
                "driverName": "prueba1@prueba1.com",
                "comments": "",
                "duration": 2.31,
                "endDate": new Date("2025-04-13T01:46:36.331916Z"),
                "odometerEnd": 96283
            },
            {
                "startDate": new Date("2025-04-09T01:27:00.331975Z"),
                "odometerStart": 119223,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db18d"),
                "vehiclePlate": "Z0032BY",
                "employeeId": "67f2c812ed40ed1fc1b2fa2b",
                "driverName": "prueba1@prueba1.com",
                "comments": "",
                "duration": 1.31,
                "endDate": new Date("2025-04-09T02:45:36.331975Z"),
                "odometerEnd": 119259
            },
            {
                "startDate": new Date("2025-03-21T13:38:00.332014Z"),
                "odometerStart": 60514,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db186"),
                "vehiclePlate": "4567CRD",
                "employeeId": "67f2c818ed40ed1fc1b2fa2c",
                "driverName": "prueba2@prueba2.com",
                "comments": "",
                "duration": 0.56,
                "endDate": new Date("2025-03-21T14:11:36.332014Z"),
                "odometerEnd": 60549
            },
            {
                "startDate": new Date("2025-03-17T06:13:00.332029Z"),
                "odometerStart": 100137,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db186"),
                "vehiclePlate": "4567CRD",
                "employeeId": "67f2c818ed40ed1fc1b2fa2c",
                "driverName": "prueba2@prueba2.com",
                "comments": "",
                "duration": 1.1,
                "endDate": new Date("2025-03-17T07:19:00.332029Z"),
                "odometerEnd": 100198
            },
            {
                "startDate": new Date("2025-04-13T13:24:00.332043Z"),
                "odometerStart": 36275,
                "vehicleId": new ObjectId("67f78bfbeb4480ef31b369f4"),
                "vehiclePlate": "1234BCD",
                "employeeId": "67f2c818ed40ed1fc1b2fa2c",
                "driverName": "prueba2@prueba2.com",
                "comments": "",
                "duration": 1.2,
                "endDate": new Date("2025-04-13T14:36:00.332043Z"),
                "odometerEnd": 36415
            },
            {
                "startDate": new Date("2025-03-31T16:02:00.332060Z"),
                "odometerStart": 140953,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db187"),
                "vehiclePlate": "B1234AZ",
                "employeeId": "67f2c812ed40ed1fc1b2fa2b",
                "driverName": "prueba1@prueba1.com",
                "comments": "",
                "duration": 0.74,
                "endDate": new Date("2025-03-31T16:46:24.332060Z"),
                "odometerEnd": 140967
            },
            {
                "startDate": new Date("2025-04-05T19:43:00.332089Z"),
                "odometerStart": 58166,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db189"),
                "vehiclePlate": "M7643BC",
                "employeeId": "67f2c812ed40ed1fc1b2fa2b",
                "driverName": "prueba1@prueba1.com",
                "comments": "",
                "duration": 1.18,
                "endDate": new Date("2025-04-05T20:53:48.332089Z"),
                "odometerEnd": 58225
            },
            {
                "startDate": new Date("2025-04-02T14:50:00.332104Z"),
                "odometerStart": 45543,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db18e"),
                "vehiclePlate": "7812DHL",
                "employeeId": "67f2ce1f46e0db74e048d5a7",
                "driverName": "admin@sdi.com",
                "comments": "",
                "duration": 0.27,
                "endDate": new Date("2025-04-02T15:06:12.332104Z"),
                "odometerEnd": 45587
            },
            {
                "startDate": new Date("2025-03-24T16:06:00.332121Z"),
                "odometerStart": 80594,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db189"),
                "vehiclePlate": "M7643BC",
                "employeeId": "67f2c812ed40ed1fc1b2fa2b",
                "driverName": "prueba1@prueba1.com",
                "comments": "",
                "duration": 2.89,
                "endDate": new Date("2025-03-24T18:59:24.332121Z"),
                "odometerEnd": 80725
            },
            {
                "startDate": new Date("2025-03-17T12:19:00.332135Z"),
                "odometerStart": 132892,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db18d"),
                "vehiclePlate": "Z0032BY",
                "employeeId": "67f2c818ed40ed1fc1b2fa2c",
                "driverName": "prueba2@prueba2.com",
                "comments": "",
                "duration": 0.79,
                "endDate": new Date("2025-03-17T13:06:24.332135Z"),
                "odometerEnd": 132910
            },
            {
                "startDate": new Date("2025-04-07T04:43:00.332148Z"),
                "odometerStart": 43111,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db18c"),
                "vehiclePlate": "6543NRG",
                "employeeId": "67f2ce1f46e0db74e048d5a7",
                "driverName": "admin@sdi.com",
                "comments": "",
                "duration": 0.64,
                "endDate": new Date("2025-04-07T05:21:24.332148Z"),
                "odometerEnd": 43258
            },
            {
                "startDate": new Date("2025-04-05T17:23:00.332159Z"),
                "odometerStart": 94744,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db189"),
                "vehiclePlate": "M7643BC",
                "employeeId": "67f2ce1f46e0db74e048d5a7",
                "driverName": "admin@sdi.com",
                "comments": "",
                "duration": 1.77,
                "endDate": new Date("2025-04-05T19:09:12.332159Z"),
                "odometerEnd": 94826
            },
            {
                "startDate": new Date("2025-04-08T09:16:00.332171Z"),
                "odometerStart": 11051,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db189"),
                "vehiclePlate": "M7643BC",
                "employeeId": "67f2c818ed40ed1fc1b2fa2c",
                "driverName": "prueba2@prueba2.com",
                "comments": "",
                "duration": 0.81,
                "endDate": new Date("2025-04-08T10:04:36.332171Z"),
                "odometerEnd": 11198
            },
            {
                "startDate": new Date("2025-03-30T08:17:00.332182Z"),
                "odometerStart": 98944,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db187"),
                "vehiclePlate": "B1234AZ",
                "employeeId": "67f2ce1f46e0db74e048d5a7",
                "driverName": "admin@sdi.com",
                "comments": "",
                "duration": 1.79,
                "endDate": new Date("2025-03-30T10:04:24.332182Z"),
                "odometerEnd": 98986
            },
            {
                "startDate": new Date("2025-04-03T04:47:00.332194Z"),
                "odometerStart": 104032,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db18a"),
                "vehiclePlate": "1023LSK",
                "employeeId": "67f2c818ed40ed1fc1b2fa2c",
                "driverName": "prueba2@prueba2.com",
                "comments": "",
                "duration": 0.45,
                "endDate": new Date("2025-04-03T05:14:00.332194Z"),
                "odometerEnd": 104064
            },
            {
                "startDate": new Date("2025-03-27T05:33:00.332206Z"),
                "odometerStart": 77716,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db18b"),
                "vehiclePlate": "C4567ER",
                "employeeId": "67f2c818ed40ed1fc1b2fa2c",
                "driverName": "prueba2@prueba2.com",
                "comments": "",
                "duration": 2.28,
                "endDate": new Date("2025-03-27T07:49:48.332206Z"),
                "odometerEnd": 77828
            },
            {
                "startDate": new Date("2025-03-18T19:26:00.332217Z"),
                "odometerStart": 131186,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db18c"),
                "vehiclePlate": "6543NRG",
                "employeeId": "67f2c812ed40ed1fc1b2fa2b",
                "driverName": "prueba1@prueba1.com",
                "comments": "",
                "duration": 2.98,
                "endDate": new Date("2025-03-18T22:24:48.332217Z"),
                "odometerEnd": 131275
            },
            {
                "startDate": new Date("2025-03-20T04:12:00.332229Z"),
                "odometerStart": 64408,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db18a"),
                "vehiclePlate": "1023LSK",
                "employeeId": "67f2ce1f46e0db74e048d5a7",
                "driverName": "admin@sdi.com",
                "comments": "",
                "duration": 2.72,
                "endDate": new Date("2025-03-20T06:55:12.332229Z"),
                "odometerEnd": 64439
            },
            {
                "startDate": new Date("2025-03-24T21:35:00.332240Z"),
                "odometerStart": 146619,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db186"),
                "vehiclePlate": "4567CRD",
                "employeeId": "67f2c812ed40ed1fc1b2fa2b",
                "driverName": "prueba1@prueba1.com",
                "comments": "",
                "duration": 1.32,
                "endDate": new Date("2025-03-24T22:54:12.332240Z"),
                "odometerEnd": 146657
            },
            {
                "startDate": new Date("2025-03-20T10:22:00.332252Z"),
                "odometerStart": 58190,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db18d"),
                "vehiclePlate": "Z0032BY",
                "employeeId": "67f2c818ed40ed1fc1b2fa2c",
                "driverName": "prueba2@prueba2.com",
                "comments": "",
                "duration": 1.01,
                "endDate": new Date("2025-03-20T11:22:36.332252Z"),
                "odometerEnd": 58265
            },
            {
                "startDate": new Date("2025-04-02T23:11:00.332268Z"),
                "odometerStart": 119698,
                "vehicleId": new ObjectId("67f78bfbeb4480ef31b369f4"),
                "vehiclePlate": "1234BCD",
                "employeeId": "67f2ce1f46e0db74e048d5a7",
                "driverName": "admin@sdi.com",
                "comments": "",
                "duration": 1.09,
                "endDate": new Date("2025-04-03T00:16:24.332268Z"),
                "odometerEnd": 119848
            },
            {
                "startDate": new Date("2025-03-22T23:40:00.332286Z"),
                "odometerStart": 93587,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db18b"),
                "vehiclePlate": "C4567ER",
                "employeeId": "67f2ce1f46e0db74e048d5a7",
                "driverName": "admin@sdi.com",
                "comments": "",
                "duration": 1.64,
                "endDate": new Date("2025-03-23T01:18:24.332286Z"),
                "odometerEnd": 93727
            },
            {
                "startDate": new Date("2025-04-08T09:26:00.332299Z"),
                "odometerStart": 110482,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db18a"),
                "vehiclePlate": "1023LSK",
                "employeeId": "67f2c812ed40ed1fc1b2fa2b",
                "driverName": "prueba1@prueba1.com",
                "comments": "",
                "duration": 1.67,
                "endDate": new Date("2025-04-08T11:06:12.332299Z"),
                "odometerEnd": 110533
            },
            {
                "startDate": new Date("2025-03-23T20:48:00.332311Z"),
                "odometerStart": 125299,
                "vehicleId": new ObjectId("67f78bfbeb4480ef31b369f4"),
                "vehiclePlate": "1234BCD",
                "employeeId": "67f2c818ed40ed1fc1b2fa2c",
                "driverName": "prueba2@prueba2.com",
                "comments": "",
                "duration": 2.25,
                "endDate": new Date("2025-03-23T23:03:00.332311Z"),
                "odometerEnd": 125448
            },
            {
                "startDate": new Date("2025-03-15T23:21:00.332322Z"),
                "odometerStart": 102575,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db189"),
                "vehiclePlate": "M7643BC",
                "employeeId": "67f2ce1f46e0db74e048d5a7",
                "driverName": "admin@sdi.com",
                "comments": "",
                "duration": 1.2,
                "endDate": new Date("2025-03-16T00:33:00.332322Z"),
                "odometerEnd": 102649
            },
            {
                "startDate": new Date("2025-04-08T21:53:00.332334Z"),
                "odometerStart": 118751,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db187"),
                "vehiclePlate": "B1234AZ",
                "employeeId": "67f2c818ed40ed1fc1b2fa2c",
                "driverName": "prueba2@prueba2.com",
                "comments": "",
                "duration": 2.78,
                "endDate": new Date("2025-04-09T00:39:48.332334Z"),
                "odometerEnd": 118850
            },
            {
                "startDate": new Date("2025-03-14T23:56:00.332345Z"),
                "odometerStart": 141211,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db18c"),
                "vehiclePlate": "6543NRG",
                "employeeId": "67f2ce1f46e0db74e048d5a7",
                "driverName": "admin@sdi.com",
                "comments": "",
                "duration": 1.9,
                "endDate": new Date("2025-03-15T01:50:00.332345Z"),
                "odometerEnd": 141246
            },
            {
                "startDate": new Date("2025-04-09T09:48:00.332357Z"),
                "odometerStart": 121971,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db18e"),
                "vehiclePlate": "7812DHL",
                "employeeId": "67f2ce1f46e0db74e048d5a7",
                "driverName": "admin@sdi.com",
                "comments": "",
                "duration": 1.33,
                "endDate": new Date("2025-04-09T11:07:48.332357Z"),
                "odometerEnd": 122035
            },
            {
                "startDate": new Date("2025-03-27T18:43:00.332368Z"),
                "odometerStart": 37135,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db18e"),
                "vehiclePlate": "7812DHL",
                "employeeId": "67f2ce1f46e0db74e048d5a7",
                "driverName": "admin@sdi.com",
                "comments": "",
                "duration": 2.74,
                "endDate": new Date("2025-03-27T21:27:24.332368Z"),
                "odometerEnd": 37195
            },
            {
                "startDate": new Date("2025-03-17T07:42:00.332384Z"),
                "odometerStart": 57470,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db18a"),
                "vehiclePlate": "1023LSK",
                "employeeId": "67f2c812ed40ed1fc1b2fa2b",
                "driverName": "prueba1@prueba1.com",
                "comments": "",
                "duration": 1.1,
                "endDate": new Date("2025-03-17T08:48:00.332384Z"),
                "odometerEnd": 57574
            },
            {
                "startDate": new Date("2025-03-21T11:24:00.332404Z"),
                "odometerStart": 144064,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db18a"),
                "vehiclePlate": "1023LSK",
                "employeeId": "67f2ce1f46e0db74e048d5a7",
                "driverName": "admin@sdi.com",
                "comments": "",
                "duration": 1.43,
                "endDate": new Date("2025-03-21T12:49:48.332404Z"),
                "odometerEnd": 144077
            },
            {
                "startDate": new Date("2025-03-27T19:57:00.332421Z"),
                "odometerStart": 105373,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db18a"),
                "vehiclePlate": "1023LSK",
                "employeeId": "67f2ce1f46e0db74e048d5a7",
                "driverName": "admin@sdi.com",
                "comments": "",
                "duration": 2.44,
                "endDate": new Date("2025-03-27T22:23:24.332421Z"),
                "odometerEnd": 105446
            },
            {
                "startDate": new Date("2025-03-25T03:24:00.332433Z"),
                "odometerStart": 21457,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db18a"),
                "vehiclePlate": "1023LSK",
                "employeeId": "67f2c812ed40ed1fc1b2fa2b",
                "driverName": "prueba1@prueba1.com",
                "comments": "",
                "duration": 0.49,
                "endDate": new Date("2025-03-25T03:53:24.332433Z"),
                "odometerEnd": 21599
            },
            {
                "startDate": new Date("2025-03-16T01:17:00.332444Z"),
                "odometerStart": 85798,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db18a"),
                "vehiclePlate": "1023LSK",
                "employeeId": "67f2ce1f46e0db74e048d5a7",
                "driverName": "admin@sdi.com",
                "comments": "",
                "duration": 2.81,
                "endDate": new Date("2025-03-16T04:05:36.332444Z"),
                "odometerEnd": 85886
            },
            {
                "startDate": new Date("2025-03-28T18:30:00.332456Z"),
                "odometerStart": 100354,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db18b"),
                "vehiclePlate": "C4567ER",
                "employeeId": "67f2c812ed40ed1fc1b2fa2b",
                "driverName": "prueba1@prueba1.com",
                "comments": "",
                "duration": 2.07,
                "endDate": new Date("2025-03-28T20:34:12.332456Z"),
                "odometerEnd": 100463
            },
            {
                "startDate": new Date("2025-04-08T12:41:00.332467Z"),
                "odometerStart": 109826,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db189"),
                "vehiclePlate": "M7643BC",
                "employeeId": "67f2c818ed40ed1fc1b2fa2c",
                "driverName": "prueba2@prueba2.com",
                "comments": "",
                "duration": 1.57,
                "endDate": new Date("2025-04-08T14:15:12.332467Z"),
                "odometerEnd": 109953
            },
            {
                "startDate": new Date("2025-03-30T21:34:00.332478Z"),
                "odometerStart": 140723,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db189"),
                "vehiclePlate": "M7643BC",
                "employeeId": "67f2c818ed40ed1fc1b2fa2c",
                "driverName": "prueba2@prueba2.com",
                "comments": "",
                "duration": 2.18,
                "endDate": new Date("2025-03-30T23:44:48.332478Z"),
                "odometerEnd": 140818
            },
            {
                "startDate": new Date("2025-04-04T03:28:00.332489Z"),
                "odometerStart": 83269,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db186"),
                "vehiclePlate": "4567CRD",
                "employeeId": "67f2ce1f46e0db74e048d5a7",
                "driverName": "admin@sdi.com",
                "comments": "",
                "duration": 0.71,
                "endDate": new Date("2025-04-04T04:10:36.332489Z"),
                "odometerEnd": 83416
            },
            {
                "startDate": new Date("2025-03-26T20:08:00.332500Z"),
                "odometerStart": 83739,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db187"),
                "vehiclePlate": "B1234AZ",
                "employeeId": "67f2c812ed40ed1fc1b2fa2b",
                "driverName": "prueba1@prueba1.com",
                "comments": "",
                "duration": 1.7,
                "endDate": new Date("2025-03-26T21:50:00.332500Z"),
                "odometerEnd": 83759
            },
            {
                "startDate": new Date("2025-03-31T04:31:00.332512Z"),
                "odometerStart": 28736,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db189"),
                "vehiclePlate": "M7643BC",
                "employeeId": "67f2ce1f46e0db74e048d5a7",
                "driverName": "admin@sdi.com",
                "comments": "",
                "duration": 2.61,
                "endDate": new Date("2025-03-31T07:07:36.332512Z"),
                "odometerEnd": 28832
            },
            {
                "startDate": new Date("2025-03-19T00:07:00.332523Z"),
                "odometerStart": 112071,
                "vehicleId": new ObjectId("67f78bfbeb4480ef31b369f4"),
                "vehiclePlate": "1234BCD",
                "employeeId": "67f2c818ed40ed1fc1b2fa2c",
                "driverName": "prueba2@prueba2.com",
                "comments": "",
                "duration": 1.6,
                "endDate": new Date("2025-03-19T01:43:00.332523Z"),
                "odometerEnd": 112202
            },
            {
                "startDate": new Date("2025-04-13T08:43:00.332535Z"),
                "odometerStart": 19248,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db18b"),
                "vehiclePlate": "C4567ER",
                "employeeId": "67f2c812ed40ed1fc1b2fa2b",
                "driverName": "prueba1@prueba1.com",
                "comments": "",
                "duration": 2.91,
                "endDate": new Date("2025-04-13T11:37:36.332535Z"),
                "odometerEnd": 19312
            },
            {
                "startDate": new Date("2025-04-13T07:47:00.332546Z"),
                "odometerStart": 127962,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db18e"),
                "vehiclePlate": "7812DHL",
                "employeeId": "67f2c818ed40ed1fc1b2fa2c",
                "driverName": "prueba2@prueba2.com",
                "comments": "",
                "duration": 2.27,
                "endDate": new Date("2025-04-13T10:03:12.332546Z"),
                "odometerEnd": 128042
            },
            {
                "startDate": new Date("2025-03-15T09:31:00.332557Z"),
                "odometerStart": 69251,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db186"),
                "vehiclePlate": "4567CRD",
                "employeeId": "67f2ce1f46e0db74e048d5a7",
                "driverName": "admin@sdi.com",
                "comments": "",
                "duration": 1.87,
                "endDate": new Date("2025-03-15T11:23:12.332557Z"),
                "odometerEnd": 69285
            },
            {
                "startDate": new Date("2025-04-10T09:51:00.332568Z"),
                "odometerStart": 95829,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db189"),
                "vehiclePlate": "M7643BC",
                "employeeId": "67f2ce1f46e0db74e048d5a7",
                "driverName": "admin@sdi.com",
                "comments": "",
                "duration": 2.28,
                "endDate": new Date("2025-04-10T12:07:48.332568Z"),
                "odometerEnd": 95893
            },
            {
                "startDate": new Date("2025-03-17T12:19:00.332592Z"),
                "odometerStart": 12881,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db186"),
                "vehiclePlate": "4567CRD",
                "employeeId": "67f2c812ed40ed1fc1b2fa2b",
                "driverName": "prueba1@prueba1.com",
                "comments": "",
                "duration": 0.63,
                "endDate": new Date("2025-03-17T12:56:48.332592Z"),
                "odometerEnd": 12983
            },
            {
                "startDate": new Date("2025-04-05T07:17:00.332604Z"),
                "odometerStart": 22954,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db18e"),
                "vehiclePlate": "7812DHL",
                "employeeId": "67f2c812ed40ed1fc1b2fa2b",
                "driverName": "prueba1@prueba1.com",
                "comments": "",
                "duration": 0.3,
                "endDate": new Date("2025-04-05T07:35:00.332604Z"),
                "odometerEnd": 23011
            },
            {
                "startDate": new Date("2025-03-15T03:38:00.332616Z"),
                "odometerStart": 46328,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db189"),
                "vehiclePlate": "M7643BC",
                "employeeId": "67f2ce1f46e0db74e048d5a7",
                "driverName": "admin@sdi.com",
                "comments": "",
                "duration": 0.34,
                "endDate": new Date("2025-03-15T03:58:24.332616Z"),
                "odometerEnd": 46379
            },
            {
                "startDate": new Date("2025-03-29T15:26:00.332628Z"),
                "odometerStart": 121080,
                "vehicleId": new ObjectId("67f78c358c8c58e3e50db186"),
                "vehiclePlate": "4567CRD",
                "employeeId": "67f2ce1f46e0db74e048d5a7",
                "driverName": "admin@sdi.com",
                "comments": "",
                "duration": 2.44,
                "endDate": new Date("2025-03-29T17:52:24.332628Z"),
                "odometerEnd": 121152
            },
            {
                "startDate": new Date("2025-03-23T12:15:00.332639Z"),
                "odometerStart": 116941,
                "vehicleId": new ObjectId("67f78bfbeb4480ef31b369f4"),
                "vehiclePlate": "1234BCD",
                "employeeId": "67f2c812ed40ed1fc1b2fa2b",
                "driverName": "prueba1@prueba1.com",
                "comments": "",
                "duration": 2.1,
                "endDate": new Date("2025-03-23T14:21:00.332639Z"),
                "odometerEnd": 117015
            },
            {
                "startDate": new Date(),
                "odometerStart": 116941,
                "vehicleId": new ObjectId("67f78bfbeb4480ef31b369f4"),
                "vehiclePlate": "1234BCD",
                "employeeId": "67f2c812ed40ed1fc1b2fa2b",
                "driverName": "prueba1@prueba1.com",
            },

        ]);

        const journeysToUpdate = await journeysCollection.find({}).toArray();

        for (const journey of journeysToUpdate) {
            await journeysCollection.updateOne(
                { _id: journey._id },
                {
                    $set: {
                        driverName: "12345678Z",
                        employeeId: adminId,
                    }
                }
            );
        }

        const allVehicles = await vehiclesCollection.find({}).toArray();
        const journeyCounts = {};

        allVehicles.forEach(vehicle => {
            journeyCounts[vehicle.numberPlate] = 0;
        });

        const existingJourneys = await journeysCollection.find({}).toArray();
        existingJourneys.forEach(journey => {
            if (journey.vehiclePlate in journeyCounts) {
                journeyCounts[journey.vehiclePlate]++;
            }
        });

        const adminUser = await usersCollection.findOne({ role: "ADMIN" });

        const currentDate = new Date();

        const journeyTemplates = [];
        for (let i = 0; i < 10; i++) {
            const daysAgo = 28 - Math.floor(i * 2.8);
            const hoursOffset = 9 + i;
            const startDate = new Date(currentDate);
            startDate.setDate(startDate.getDate() - daysAgo);
            startDate.setHours(hoursOffset % 24, (i * 6) % 60, 0);

            const duration = (0.5 + (i % 5) * 0.5).toFixed(2);

            const endDate = new Date(startDate);
            const durationHours = Math.floor(duration);
            const durationMinutes = Math.round((duration - durationHours) * 60);
            endDate.setHours(endDate.getHours() + durationHours, endDate.getMinutes() + durationMinutes);

            journeyTemplates.push({
                startDate,
                endDate,
                duration: parseFloat(duration)
            });
        }

        const newJourneys = [];
        const journeysToRemove = [];

        for (const vehicle of allVehicles) {
            const currentCount = journeyCounts[vehicle.numberPlate] || 0;

            if (currentCount < 10) {
                const journeysToAdd = 10 - currentCount;
                console.log(`Adding ${journeysToAdd} journeys to vehicle ${vehicle.numberPlate}`);

                let baseOdometer = 5000;
                const vehicleJourneys = existingJourneys.filter(j => j.vehiclePlate === vehicle.numberPlate);
                if (vehicleJourneys.length > 0) {
                    const maxOdometer = Math.max(...vehicleJourneys.map(j => j.odometerEnd || 0));
                    baseOdometer = maxOdometer > 0 ? maxOdometer : Math.floor(Math.random() * 80000) + 5000;
                } else {
                    baseOdometer = Math.floor(Math.random() * 80000) + 5000;
                }

                for (let i = 0; i < journeysToAdd; i++) {
                    const templateIndex = (currentCount + i) % 10;
                    const template = journeyTemplates[templateIndex];

                    const odometerStart = baseOdometer + (i * 100);
                    const distanceTraveled = Math.floor(Math.random() * 80) + 20; // 20-100 km per journey
                    const odometerEnd = odometerStart + distanceTraveled;

                    const journey = {
                        startDate: new Date(template.startDate),
                        odometerStart: odometerStart,
                        vehicleId: vehicle._id,
                        vehiclePlate: vehicle.numberPlate,
                        employeeId: adminUser._id,
                        driverName: adminUser.dni,
                        comments: `Journey ${currentCount + i + 1} for ${vehicle.numberPlate}`,
                        duration: template.duration,
                        endDate: new Date(template.endDate),
                        odometerEnd: odometerEnd
                    };

                    newJourneys.push(journey);
                }
            } else if (currentCount > 10) {

                const journeysToRemoveCount = currentCount - 10;

                const vehicleJourneys = existingJourneys.filter(j => j.vehiclePlate === vehicle.numberPlate);

                vehicleJourneys.sort((a, b) => a.startDate - b.startDate);

                for (let i = 0; i < journeysToRemoveCount; i++) {
                    if (vehicleJourneys[i] && vehicleJourneys[i]._id) {
                        journeysToRemove.push(vehicleJourneys[i]._id);
                    }
                }
            }
        }

        if (journeysToRemove.length > 0) {
            await journeysCollection.deleteMany({ _id: { $in: journeysToRemove } });
            console.log(`Removed ${journeysToRemove.length} excess journeys.`);
        }

        if (newJourneys.length > 0) {
            await journeysCollection.insertMany(newJourneys);
            console.log(`Added ${newJourneys.length} new journeys to ensure all vehicles have exactly 10 journeys.`);
        }


    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

