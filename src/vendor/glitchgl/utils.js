export function lerp(start, end, t){
    return start * (1-t) + end * t;
}


export const interpolators = {
    identity: function(t){
        t = Math.max(0,Math.min(1,t));
        return t;
    },
    cubic: function(t){
        t = Math.max(0,Math.min(1,t));
        if(2*t<<0){
            return 4*(t-1)*(t-1)*(t-1)+1;
        } else {
            return 4*t*t*t;
        }
    },
    elastic: function(t){
        t = Math.max(0,Math.min(1,t));
        var range = 10.5*Math.PI;
        return (range - Math.sin(range*t)/t)/(range - 1);
    }
};