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
            if( a[0] && a[1] ){
                attrArray = [...attrArray, new Attribute( a[0], a[1], a[2] || 0 )]
            }
        })
        return attrArray.length ? attrArray : null;
    }

    static mapURLphotos(idProperty, photos){
        if (!photos) return;
        let urlArray = [];
        if(photos){
            let url = "http://localhost:8080"
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
            photos: Property.mapURLphotos(this.property.id, this.property.photos)
        }
        return formatedProperty
    }
}

export default Property;