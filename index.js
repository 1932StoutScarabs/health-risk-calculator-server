const express = require('express')
app = express()

const cors = require("cors")

const port = process.env.PORT || 3000


// Use Express to publish static HTML, CSS, and JavaScript files that run in the browser. 
app.use(express.json())
app.use(express.static(__dirname + '/static'))
app.use(cors({ origin: '*' }))

// The app.get functions below are being processed in Node.js running on the server.
app.get('/api/ping', (request, response) => {
	response.type('text/plain').send('Server is awake');
})

app.post('/calc-risk', (req, res) => {
    //Receive JSON with FamilyDiseaseCount, age, bloodPressure, feet of height, inches of height, and weight
    const { familyDiseaseCount, age, bloodPressure, heightFeet, heightInches, weight } = req.body;

    if(familyDiseaseCount === undefined || age === undefined || !bloodPressure || heightFeet === undefined || heightInches === undefined || weight === undefined){
        return res.status(400).json({ error: "Missing required parameters" });
    }

    const totalHeightInches = heightFeet * 12 + heightInches;

    //Send BMI and Risk in back to client in JSON
    res.json(calculateRisk(familyDiseaseCount, age, bloodPressure, totalHeightInches, weight))
});

function calculateRisk(familyDiseaseCount, age, bloodPressure, height, weight){
	try {
		const BMI = calculateBMI(height, weight)
		const risk = calculateFamDis(familyDiseaseCount) + calculateAgeRisk(age) + calculateBP(bloodPressure) + calculateBMIRisk(BMI)
		let riskLevel;
		if (risk < 20 ){
			riskLevel = "Low Risk"
		} else if (risk >= 20 && risk <= 50){
			riskLevel = "Moderate Risk"
		} else if (risk >= 50 && risk <= 75){
			riskLevel = "High Risk"
		} else {
			riskLevel = "Uninsurable"
		}
		return({
			BMI: BMI.toFixed(2),
			Risk: riskLevel
		})
		// BMI and Risk are the values in the JSON object that we will be returning, to be used in the HTML.
	} catch (exception){
		console.log("Something went wrong with the calculation")
		// Values could have been null :)
	}
}

function calculateFamDis(familyDiseaseCount /*This is the amount of family disease they have (1-3)*/){
	// This will calculate the points associated with family disease.
	// This value should be the amount of family diseases that a person has, instead of individual, making calculations easier.
	if (familyDiseaseCount == 1){
		return parseInt(10)
	} else if (familyDiseaseCount == 2){
		return parseInt(20) 
	} else if (familyDiseaseCount == 3){
		return parseInt(30)
	} else if (familyDiseaseCount == 0) {
		return parseInt(0)
	} else {
		return null //default value for invalid parameter just in case.
	}
}
function calculateAgeRisk(AgeValue /*This param is the age value*/){
	// This will calculate the points assocaited with age
	if (AgeValue < 30) {
		return parseInt(0);
	} else if (AgeValue < 45) {
		return parseInt(10);
	} else if (AgeValue < 60) {
		return parseInt(20);
	} else {
		return parseInt(30); // For 60+
	}
}
function calculateBP(bloodPressure /*This param is the type of bloodpressure will be a string */){
	// This will calculate the points associated with bloodpressure
	switch (bloodPressure){
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

function calculateBMIRisk(BMI){
	if(BMI >= 18.5 && BMI <= 24.9) return 0
	else if(BMI >= 25 && BMI <= 29.9) return 30
	else return  75
}

function calculateBMI(heightIN, weightLBS /*These will be the input parameters in the future*/){
	console.log("Calculating BMI now!")
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