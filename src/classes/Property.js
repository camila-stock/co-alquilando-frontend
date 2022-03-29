import Attribute from './Attribute'

class Property{
    constructor(property){
		this.property = property;
    }

    static mapArrayToJson(attrArray){
        if (!attrArray) return;
        let attrJson = {};
        attrArray.forEach((t) => {
            attrJson = {...attrJson, [t.attributeType]: t.value}
        });
        return {...attrJson}
    }

    static mapJsonToArray(attrJson){
        if (!attrJson) return;
        let entries = Object.entries(attrJson);
        let attrArray = [];
        entries.forEach( a => {
            if (a[0] === 'ownerInhabited') {
                attrArray = [...attrArray, new Attribute( a[0], a[1] || "false", a[2] || 0 )]
            } else if (a[0] && a[1]) {
                attrArray = [...attrArray, new Attribute( a[0], a[1], a[2] || 0 )]
            }
        })
        return attrArray.length ? attrArray : null;
    }

    static mapURLphotos(idProperty, photos){
        if (!photos) return ["https://omegamma.com.au/wp-content/uploads/2017/04/default-image-720x530.jpg"]
        let urlArray = [];
        if(photos){
            let url = "https://ec2-34-219-1-255.us-west-2.compute.amazonaws.com:8080"
            let endpoint = `/property/${idProperty}/photos/`
            photos.forEach( id => {
                let photoUrl = url + endpoint + id
                urlArray = [...urlArray, photoUrl]
            })
        }
        return urlArray;
    }

    mapResponseToJson(){
        let formatedProperty = {
            ...this.property,
            attributes: Property.mapArrayToJson( this.property.attributes ),
            photos: Property.mapURLphotos(this.property.id, this.property.photos),
            coordinates: this.property.address.coordinates
        }
        return formatedProperty
    }

    mapResponseToFormJson(){
        let formatedProperty = {
            ...this.property,
            attributes: Property.mapArrayToJson( this.property.attributes ),
            coordinates: this.property.address.coordinates
        }
        return formatedProperty
    }

    mapJsonToRequest(){
        let formatedProperty = {
            ...this.property,
            attributes: Property.mapJsonToArray(this.property.attributes),
            address: {...this.property.address, coordinates: this.property.coordinates}
        }
        return formatedProperty
    }
}

export default Property;