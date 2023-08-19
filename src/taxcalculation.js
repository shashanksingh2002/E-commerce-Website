module.exports = {
    taxCalculationProducts: (cost) => {
        cost = Number(cost);
        if(cost <= 1000){
            cost += 200;
        }
        else if(cost > 1000 && cost <= 5000){
            cost += (cost*(0.12));
        }
        else{
            cost += (cost*(0.18));
        }
        return cost;
    },
    taxCalculationServices: (cost) => {
        cost = Number(cost);
        if(cost <= 1000){
            cost += 100;
        }
        else if(cost > 1000 && cost <= 8000){
            cost += (cost*(0.1));
        }
        else{
            cost += (cost*(0.15));
        }
        return cost;
    }
}