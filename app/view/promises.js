/* ./promises.js */

module.exports = Promises;
function Promises (...args) {

    var args = args;

    function my (p) {
        return Promise.resolve(args)
            .then(typeof p === 'function'
                ? args => p(...args)
                : () => p
            );
    }

    my.object = (...objs) => Promise
        .all(objs.map(my))
        .then(objs => Object.assign({}, ...objs));
    
    return my;
}

/* usage:
 
 : Promises('Dieu te le rendra')(str => str + ' au centuple')
    >> Promise.resolve('Dieu te le rendra au centuple')

 : Promises(guinguette).object(
 :     {cherche: 'Juliette', trouve: 'Margaux'},
 :     guinguette => guinguette.has('Juliette')
 :         .then(j => ({regrette: !j})),
 :     {squelette: 'joue des castagnettes'}
 :  ); 
   >> Promise.pending({...})
*/

