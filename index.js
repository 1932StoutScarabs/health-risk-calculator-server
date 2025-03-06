const express = require('express')
app = express()

const cors = require("cors")

const port = process.env.PORT || 3000


// Use Express to publish static HTML, CSS, and JavaScript files that run in the browser. 
app.use(express.static(__dirname + '/static'))
app.use(cors({ origin: '*' }))

// The app.get functions below are being processed in Node.js running on the server.

app.get('/api/ping', (request, response) => {
	console.log('Calling "/api/ping"')
	response.type('text/plain')
	response.send('ping response')
})


// Calculating Risk Function
/*
app.get('/ca', (request, response) => {
	console.log('Calling "/calculate-bmi" on the Node.js server.')
	var inputs = url.parse(request.url, true).query
	const heightFeet = parseInt(inputs.feet)
	const heightInches = parseInt(inputs.inches)
	const weight = parseInt(inputs.lbs)

	console.log('Height:' + heightFeet + '\'' + heightInches + '\"')
	console.log('Weight:' + weight + ' lbs.')

	// Todo: Implement unit conversions and BMI calculations.
	// Todo: Return BMI instead of Todo message.

	response.type('text/plain')
	response.send('Todo: Implement "/calculate-bmi"')
})
*/

app.get('/calc-risk', (req, res) => {
	res.send(`This is a message hehe! 
		---------------------
		Fam Disease: ${calculateFamDis(2)}
		---------------------
		Age Risk: ${calculateAgeRisk(46)}
		---------------------
		Blood Pressure: ${calculateBP("elevated")}
		---------------------
		BMI Risk: ${calculateBMIRisk(calculateBMI())}
		---------------------
		`)

	
	
})

function calculateRisk(){
	// this will be the eventual risk calculation that will be returned through /calc-risk
	
}

function calculateFamDis(param1 /* This param is the amount of family disease they have*/){
	// This will calculate the points associated with family disease.
	// This value should be the amount of family diseases that a person has, instead of individual, making calculations easier.
	if (param1 == 1){
		return parseInt(10)
	} else if (param1 == 2){
		return parseInt(20) 
	} else if (param1 == 3){
		return parseInt(30)
	} else {
		return null //default value for invalid number.
	}
}
function calculateAgeRisk(param1 /*This param is the age they are */){
	// This will calculate the points assocaited with age
	switch (param1){
		case (param1 < 30):
			//statment here
			return parseInt(0)
		case (param1 < 45):
			//statement here
			return parseInt(10)
		case (param1 < 60):
			//statement here
			return parseInt(20)
		case (param1):
			//statment for value above or below these.	
			return parseInt(30)
	}
}
function calculateBP(param1 /*This param is the type of bloodpressure */){
	// This will calculate the points associated with bloodpressure
	switch (param1){
		case "normal":
			//statement here all are value points being returned
			return parseInt(0)
		case "elevated":
			//statement here all are value points being returned
			return parseInt(15)
		case "stage1":
			//statement here all are value points being returned
			return parseInt(30)
		case "stage2":
			//statment here all are value points being returned
			return parseInt(75) 
		case "crisis": 
			//statement here all are value points being returned
			return parseInt(100) 
		default:
			return null // Weird val, will change later. 

	}
}
function calculateBMIRisk(param1 /* This will be the BMI value */){
	// Switch statements dont support ranges between values so I had to use an if-else statement here.
	if(param1 >= 18.5 && param1 <= 24.9){
		return 0
	}else if(param1 >= 25 && param1 <= 29.9){
		return 30
	}else if(param1 >= 30 && param1 <= 34.9){
		return  75
	}else{
		return "err"
	}

}
function calculateBMI(param1, param2 /*These will be the input parameters in the future*/){
	console.log("Calculating BMI now!")
	const weightLBS = 167 // Change these to parameterized values in the future
	const heightIN = 67 // Change these to parameterized values in the future
	bmi = convertToKg(weightLBS) / (convertToM2(heightIN))
	console.log(bmi)
	return bmi
}
function convertToKg(weightLBS){
	const weightKG = weightLBS * 0.453592
	return weightKG
}
function convertToM2(heightIN){
	const heightIN2 = heightIN * heightIN 
	const heightM2 = heightIN2 * 0.00064516
	return heightM2
}




// Custom 404 page.
app.use((request, response) => {
  response.type('text/plain')
  response.status(404)
  response.send('404 - Not Found')
})

// Custom 500 page.
app.use((err, request, response, next) => {
  console.error(err.message)
  response.type('text/plain')
  response.status(500)
  response.send('500 - Server Error')
})

app.listen(port, () => console.log(
  `Express started at \"http://localhost:${port}\"\n` + `press Ctrl-C to terminate.`)
)
