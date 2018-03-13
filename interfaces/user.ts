export interface User {
  firstName: string,
  lastName: string,
  completedRegistrationDate: string,
  completedRegistration: boolean,
  profilePic: string,
  location: {
  	city: string,
  	country: string,
  	geoJson: {
  		type: string,
  		coordinates: number[]
  	},
  	postalCode: string,
  	province: string,
  	state: string
  },
}
