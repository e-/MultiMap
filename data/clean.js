var 
    fs = require('fs'),
    xml2js = require('xml2js')
    ;

var parser = new xml2js.Parser(),
    r2s = [],
    leaves = [],
    id = 0;

var temperatureN = 20;

function sanitize(r){
  return r.replace(/\r/g,'').replace(/\t/g,'').replace(/\n/g,'');
}

function fill(data){
  if(!data.children)
    return;
  
  data.size = 0;
  data.population = 0;
  data.popRatio = 0;
  data.temperature = new Array(temperatureN);
  var i;
  for(i=0;i<temperatureN;++i)
    data.temperature[i] = 0;
  
  data.vehicle = [0, 0, 0, 0];

  data.children.forEach(function(child){
    fill(child);
    data.size += child.size;
    data.population += child.population;
    data.popRatio += child.popRatio * child.population;
    for(i=0;i<temperatureN;++i)
      data.temperature[i] += child.temperature[i];
    data.vehicle[0] += child.vehicle[0];
    data.vehicle[1] += child.vehicle[1];
    data.vehicle[2] += child.vehicle[2];
    data.vehicle[3] += child.vehicle[3];
  });
  
  for(i=0;i<temperatureN;++i)
    data.temperature[i] /= data.children.length;
  data.popRatio /= data.population;
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
        children: [r2s[4], r2s[5], r2s[6], r2s[16]]
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
  loadSize();

  loadTemperature();
  loadVehicle();

  fill(r0s);

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


function loadSize(){
  var raw = fs.readFileSync('size.data').toString();
  raw.split('\n').forEach(function(line2){
    if(line2.trim().length == 0) return;
    var line = line2.split(' '),
        sido = line[1],
        name = line[2],
        bun = parseInt(line[3]),
        number = parseFloat(line[4]),
        num2 = parseFloat(line[5]);

    var matched = 0;

    if(isNaN(bun)) {
//      console.log('two address', sido, name);
      r2s.forEach(function(r2){
        r2.children.forEach(function(r3){
          if(r2.name == sido && r3.name.indexOf(name) == 0) { //일치
            if(r3.size) r3.size += number;
            else r3.size = number;
            matched ++;
          }
        });
      });

      if(matched !== 1) console.log('critical!');


      return;
    }
    if(isNaN(number)) console.error('no number', name);
    

    r2s.forEach(function(r2){
      r2.children.forEach(function(r3){
        if(r2.name == sido && r3.name.indexOf(name) == 0) { //일치
          if(name =="고성군") 
            console.log(r2.name, sido, r2.name, name, number);
          if(r3.size) console.log('ERRORR!!!');
          r3.size = number;
          matched ++;
        }
      });
    });

    if(matched != 1){
      console.error('dup or absent', sido, name);
    }
  });

  leaves.forEach(function(leaf){
    if(!leaf.size)
      console.error('no pop', leaf.name);
  });
}

function getRandomSine(q, w, e, r){
  var a = Math.random()*q + w;
  var b = Math.random()*e + r;
  
  return function(i){
    return a * Math.sin(b * i / Math.PI);
  }
}

function loadTemperature(){
  var s1, s2, s3,
      arr = [], i,
      nn = temperatureN;

  for(i=0;i<nn;++i)
    arr.push(i);

  leaves.forEach(function(leaf){
    s1 = getRandomSine(10, 1, 30, 3);
    s2 = getRandomSine(5, 2, 20, 2);
    s3 = getRandomSine(2, 3, 10, 1);
    
    leaf.temperature = [];

    for(i=0;i<nn;++i){
      leaf.temperature.push((s1(i) + s2(i) + s3(i) + leaf.id) / 20 + 15 );
    }
    
  });
}

function rnd_snd() {
    return (Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1);
}

function rnd(mean, stdev) {
    return Math.round(rnd_snd()*stdev+mean);
}

function q(x, leaf){
  return Math.round(leaf.population / 300000 * x);
}

function loadVehicle(){
  leaves.forEach(function(leaf){
    leaf.vehicle = [
      q(rnd(10000, 3000), leaf),
      q(rnd(1000, 500), leaf),
      q(rnd(300, 100), leaf),
      q(rnd(100, 50), leaf)
    ];
  });
}

