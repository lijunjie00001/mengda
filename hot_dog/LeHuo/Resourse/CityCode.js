
import City from './anhui_area'
import NewCity from './anhuicity_area'
export default class CityCode {
    static getNewCity(){
         return City;
    }
    static getNewCityName(ds,qx){
        let area=''
        let json={}
        //市
        if(ds){
            let array=this.getNewCity();
            for(let i=0;i<array.length;i++){
                if(array[i].factValue===ds){
                    area=array[i].displayName;
                    json=array[i];
                    break;
                }
            }
        }
        // 县
        if(json.countys&&qx){
                for(let i=0;i<json.countys.length;i++){
                    if(json.countys[i].factValue===qx){
                        area=area+json.countys[i].displayName;
                        break;
                    }
                }
            }

            return area;
    }
    static getNewAdress(qx){
         let newqx=qx
         let ds=newqx.slice(0,2);
         return this.getNewCityName(ds,qx);
    }
    static  getNoAllCity(){
        return NewCity
    }

};

