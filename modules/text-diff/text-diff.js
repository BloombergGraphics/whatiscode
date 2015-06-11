
!(function(){

  var module = {sel: d3.select('[data-module="text-diff"]')}
  addModule(module)

  //cached diff object
  //update http://bl.ocks.org/1wheel/41b09ea34e825bcefb24
  var diffs = [[{"count":31,"value":"In my opinion, version control is one of the most beautiful things about programming. It"},{"count":1,"removed":true,"value":"’"},{"count":1,"added":true,"value":"'"},{"count":2,"value":"s "},{"count":1,"removed":true,"value":"one"},{"count":1,"added":true,"value":"not"},{"count":1,"value":" "},{"count":25,"removed":true,"value":"of code culture’s gifts to the world. Version control isn't "},{"count":16,"value":"like “track changes” in Microsoft Word. That"},{"count":2,"removed":true,"value":"’s"},{"count":1,"value":" "},{"count":2,"added":true,"value":"is "},{"count":21,"value":"a shameful monstrosity that can make even a powerful computer stutter"},{"count":13,"added":true,"value":". Version control is software about working"},{"count":2,"value":", "},{"count":1,"removed":true,"value":"something"},{"count":1,"added":true,"value":"and"},{"count":1,"value":" "},{"count":1,"removed":true,"value":"only"},{"count":1,"added":true,"value":"it"},{"count":1,"value":" "},{"count":2,"added":true,"value":"is "},{"count":2,"value":"a "},{"count":1,"removed":true,"value":"lawyer"},{"count":1,"added":true,"value":"tool"},{"count":1,"value":" "},{"count":1,"removed":true,"value":"could"},{"count":1,"added":true,"value":"for"},{"count":1,"value":" "},{"count":2,"removed":true,"value":"love."},{"count":1,"added":true,"value":"understanding"},{"count":1,"value":" "},{"count":1,"removed":true,"value":"No"},{"count":9,"added":true,"value":"how ideas evolve over time"},{"count":2,"value":", "},{"count":1,"removed":true,"value":"version"},{"count":1,"added":true,"value":"how"},{"count":1,"value":" "},{"count":1,"removed":true,"value":"control"},{"count":1,"added":true,"value":"mistakes"},{"count":1,"value":" "},{"count":11,"added":true,"value":"are made and fixed. It "},{"count":2,"value":"is "},{"count":1,"removed":true,"value":"something"},{"count":1,"added":true,"value":"a"},{"count":1,"value":" "},{"count":1,"removed":true,"value":"different"},{"count":41,"added":true,"value":"record of the imperfect nature of human effort that is simultaneously an expression of the human desire towards excellence and understanding"},{"count":1,"value":"."}],[{"count":128,"value":"In my opinion, version control is one of the most beautiful things about programming. It's not like “track changes” in Microsoft Word. That is a shameful monstrosity that can make even a powerful computer stutter. Version control is software about working, and it is a tool for understanding how ideas evolve over time, how mistakes are made and fixed."},{"count":49,"removed":true,"value":" It is a record of the imperfect nature of human effort that is simultaneously an expression of the human desire towards excellence and understanding."}],[{"count":31,"value":"In my opinion, version control is one of the most beautiful things about programming. It"},{"count":1,"removed":true,"value":"'"},{"count":1,"added":true,"value":"’"},{"count":2,"value":"s "},{"count":25,"added":true,"value":"one of code culture’s gifts to the world. Version control is "},{"count":42,"value":"not like “track changes” in Microsoft Word. That is a shameful monstrosity that can make even a powerful computer stutter"},{"count":13,"removed":true,"value":". Version control is software about working"},{"count":2,"value":", "},{"count":1,"removed":true,"value":"and"},{"count":1,"added":true,"value":"something"},{"count":1,"value":" "},{"count":1,"removed":true,"value":"it"},{"count":1,"added":true,"value":"only"},{"count":1,"value":" "},{"count":2,"removed":true,"value":"is "},{"count":2,"value":"a "},{"count":1,"removed":true,"value":"tool"},{"count":1,"added":true,"value":"lawyer"},{"count":1,"value":" "},{"count":1,"removed":true,"value":"for"},{"count":1,"added":true,"value":"could"},{"count":1,"value":" "},{"count":1,"removed":true,"value":"understanding"},{"count":2,"added":true,"value":"love."},{"count":1,"value":" "},{"count":9,"removed":true,"value":"how ideas evolve over time"},{"count":1,"added":true,"value":"No"},{"count":2,"value":", "},{"count":1,"removed":true,"value":"how"},{"count":1,"added":true,"value":"version"},{"count":1,"value":" "},{"count":1,"removed":true,"value":"mistakes"},{"count":1,"added":true,"value":"control"},{"count":1,"value":" "},{"count":1,"removed":true,"value":"are"},{"count":1,"added":true,"value":"is"},{"count":1,"value":" "},{"count":1,"removed":true,"value":"made"},{"count":1,"added":true,"value":"something"},{"count":1,"value":" "},{"count":4,"removed":true,"value":"and fixed."},{"count":2,"added":true,"value":"different---"}],[{"count":77,"value":"In my opinion, version control is one of the most beautiful things about programming. It’s one of code culture’s gifts to the world. Version control is not like “track changes” in Microsoft Word. That"},{"count":2,"added":true,"value":"’s"},{"count":1,"value":" "},{"count":2,"removed":true,"value":"is "},{"count":48,"value":"a shameful monstrosity that can make even a powerful computer stutter, something only a lawyer could love. No, version control is something different"},{"count":1,"removed":true,"value":"---"},{"count":2,"added":true,"value":" ..."}],[{"count":57,"value":"In my opinion, version control is one of the most beautiful things about programming. It’s one of code culture’s gifts to the world. Version control "},{"count":1,"removed":true,"value":"is"},{"count":3,"added":true,"value":"isn't"},{"count":1,"value":" "},{"count":2,"removed":true,"value":"not "},{"count":67,"value":"like “track changes” in Microsoft Word. That’s a shameful monstrosity that can make even a powerful computer stutter, something only a lawyer could love. No, version control is something different"},{"count":2,"removed":true,"value":" ..."},{"count":1,"added":true,"value":"."}]]

  //space 

  var puncuation = '.-,)’'.split('')

  function diffToWords(diff){
    var rv = []
    diff.forEach(function(obj, i){
      obj.value.split(' ').forEach(function(chr, j, array){
        var lastChar = ' '
        var nextChar = ''; k = 1
        // TODO fix spacing on evolve

        if (j == array.length - 1){
          nextChar = diff[i + k] ? diff[i + k].value[0] : ''
          while(diff[i + k] && (diff[i + k].removed || diff[i + k].added)){
            k++
            nextChar = diff[i + k] ? diff[i + k].value[0] : ''
          }          
        }
        if (nextChar){
          lastChar = _.contains(puncuation, nextChar) ? '' : ' '
        }
        rv.push({
          value:    chr + lastChar, 
          added:    obj.added, 
          removed:  obj.removed, 
          width:    obj.width,
          obj:      obj
        })
      })
    })

    d3.select('#width-calc').html('').append('div')
        .style('width', '100000px')
        .style('margin-top', '10px')
      .dataAppend(rv, 'div').append('div')
        .text(ƒ('value'))
        .each(function(d){
          d.width = this.getBoundingClientRect().width
          d.width = d.width + (_.last(d.value) == ' ' ? 4 : 0) + 'px'
        })

    return rv
  }


  var s = 1
  function updateFalling(curDiffIndex){
    var wordDiffs = diffToWords(diffs[curDiffIndex])

    if (module.active){
      d3.selectAll('#text-diff').html('')

      d3.select('#text-diff').dataAppend(wordDiffs, 'div.falling')
          .text(ƒ('value'))
          .style('width', function(d){ return d.added ? '0.0px' : d.width })
          .style('left',   function(d){ return d.added ? '-2000px' : '0px' })
        .transition().duration(0).delay(500*s)
          .style('color', function(d){ return d.added ? 'green' : d.removed ? 'red' : '' })
        .transition().duration(2000*s).delay(1000*s)
          .style('width', function(d){ return d.removed ? '0.0px' : d.width })
          .style('left',   function(d){ return d.removed ? '2000px' : '0px' })

      curDiffIndex = ++curDiffIndex % diffs.length      
    }

    window.setTimeout(function(){ updateFalling(curDiffIndex) }, 5500)
  }

  updateFalling(3)

})();
