var 
    fs = require('fs'),
    xml2js = require('xml2js')
    ;

var parser = new xml2js.Parser(),
    r2s = [],
    leaves = [],
    id = 0;

function sanitize(r){
  return r.replace(/\r/g,'').replace(/\t/g,'').replace(/\n/g,'');
}

mapXML = fs.readFileSync('korea.svg');
parser.parseString(mapXML.toString(), function(err, result){
  var json = JSON.parse(JSON.stringify(result));
  json.svg.g.forEach(function(g){
    var name2 = g.$.id;
    if(name2 == '레이어_19') return;
    
    var r2 = {
      name: name2,
      children: []
    }

    r2s.push(r2);

    if(g.path)
      g.path.forEach(function(path){
        var r3 = {
          name: path.$.id,
          d: [sanitize(path.$.d)],
          id: ++id
        };

        r2.children.push(r3);
        leaves.push(r3);
      });

    if(g.g)
      g.g.forEach(function(g){
        var r3 = {
          name: g.$.id,
          d: [],
          id: ++id
        };
        g.path.forEach(function(path){
          r3.d.push(sanitize(path.$.d));
        });
        r2.children.push(r3);
        leaves.push(r3);
      });
  });

  var r11 = {
        name: '수도권', 
        children: [r2s[0], r2s[1], r2s[2]]
      },
      r12 = {
        name: '강원도',
        children: [r2s[3]]
      },
      r13 = {
        name: '충청도',
        children: [r2s[4], r2s[5], r2s[6]]
      },
      r14 = {
        name: '전라도',
        children: [r2s[13], r2s[14], r2s[15]]
      },
      r15 = {
        name: '경상도',
        children: [r2s[8], r2s[9], r2s[10], r2s[11], r2s[12]]
      },
      r16 = {
        name: '제주도',
        children: [r2s[7]]
      };
  
  var r1s = [r11, r12, r13, r14, r15, r16];
  var r0s = {
    name: '대한민국',
    children: r1s
  };

  loadPopulation();
  
  fs.writeFileSync('data.json', JSON.stringify(r0s, undefined, 2));

   
});
  
function loadPopulation(){
  var raw = fs.readFileSync('population.data').toString();
  raw.split('\n').forEach(function(line2){
    if(line2.trim().length == 0) return;
    var line = line2.split(' '),
        name = line[0],
        number = parseInt(line[1]),
        male = parseInt(line[2]),
        female = parseInt(line[3])
    ;

    if(isNaN(number)) console.error('no number', name);
    
    var target = leaves.filter(function(leaf){
      return leaf.name == name;
    });

    if(target.length != 1){
      console.error('absent or duplicate error', name);
      return;
    }

    target = target[0];
    target.population = number;
    target.popRatio = Math.round(female / male * 1000) / 10;
  });

  leaves.forEach(function(leaf){
    if(!leaf.population)
      console.error('no pop', leaf.name);
  });
}

