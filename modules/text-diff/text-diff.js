!(function(){

  var module = {sel: d3.select('#text-diff')}
  addModule(module)

  //cached diff object
  //update http://bl.ocks.org/1wheel/41b09ea34e825bcefb24
  var diffs = [[{"count":13,"value":"In my opinion, version control is "},{"count":3,"removed":true,"value":"very beautiful"},{"count":1,"added":true,"value":"awesome"},{"count":6,"value":". It is "},{"count":2,"removed":true,"value":"frankly "},{"count":8,"value":"one of the most "},{"count":1,"removed":true,"value":"beautiful"},{"count":1,"added":true,"value":"best"},{"count":49,"value":" thing about programming. It’s not like “track changes” in Microsoft Word. That is a shameful monstrosity that can make even a "},{"count":1,"removed":true,"value":"powerful"},{"count":1,"added":true,"value":"fast"},{"count":38,"value":" computer stutter. Version control is software about working, and it is a tool for understanding how ideas evolve"},{"count":4,"removed":true,"value":" over time"},{"count":25,"value":", how mistakes are made and fixed. It is a record of "},{"count":8,"removed":true,"value":"the imperfect nature of "},{"count":30,"value":"human effort that is simultaneously an expression of the human desire towards excellence and understanding."}],[{"count":20,"value":"In my opinion, version control is awesome. It is "},{"count":2,"added":true,"value":"frankly "},{"count":8,"value":"one of the most "},{"count":1,"removed":true,"value":"best"},{"count":1,"added":true,"value":"beautiful"},{"count":88,"value":" thing about programming. It’s not like “track changes” in Microsoft Word. That is a shameful monstrosity that can make even a fast computer stutter. Version control is software about working, and it is a tool for understanding how ideas evolve"},{"count":4,"added":true,"value":" over time"},{"count":55,"value":", how mistakes are made and fixed. It is a record of human effort that is simultaneously an expression of the human desire towards excellence and understanding."}],[{"count":80,"value":"In my opinion, version control is awesome. It is frankly one of the most beautiful thing about programming. It’s not like “track changes” in Microsoft Word. That is a shameful monstrosity that can make even a "},{"count":1,"removed":true,"value":"fast"},{"count":1,"added":true,"value":"powerful"},{"count":67,"value":" computer stutter. Version control is software about working, and it is a tool for understanding how ideas evolve over time, how mistakes are made and fixed. It is a record of "},{"count":6,"added":true,"value":"the nature of "},{"count":30,"value":"human effort that is simultaneously an expression of the human desire towards excellence and understanding."}],[{"count":13,"value":"In my opinion, version control is "},{"count":1,"removed":true,"value":"awesome"},{"count":3,"added":true,"value":"very beautiful"},{"count":136,"value":". It is frankly one of the most beautiful thing about programming. It’s not like “track changes” in Microsoft Word. That is a shameful monstrosity that can make even a powerful computer stutter. Version control is software about working, and it is a tool for understanding how ideas evolve over time, how mistakes are made and fixed. It is a record of the "},{"count":2,"added":true,"value":"imperfect "},{"count":34,"value":"nature of human effort that is simultaneously an expression of the human desire towards excellence and understanding."}]]

  //space 
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
            nextChar = diff[i + k].value[0]
          }          
        }
        if (nextChar){
          lastChar = nextChar == '.' || nextChar == '-' || nextChar == ',' ? '' : ' '
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

    d3.select('#width-calc').append('div')
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

  function updateFalling(curDiffIndex){
    var wordDiffs = diffToWords(diffs[curDiffIndex])

    if (module.active){
      d3.selectAll('#text-diff').html('')

      d3.select('#text-diff').dataAppend(wordDiffs, 'div.falling')
          .text(ƒ('value'))
          .style('width', function(d){ return d.added ? '0.0px' : d.width })
          .style('left',   function(d){ return d.added ? '-2000px' : '0px' })
        .transition().duration(0).delay(500)
          .style('color', function(d){ return d.added ? 'green' : d.removed ? 'red' : '' })
        .transition().duration(2000).delay(1000)
          .style('width', function(d){ return d.removed ? '0.0px' : d.width })
          .style('left',   function(d){ return d.removed ? '2000px' : '0px' })

      curDiffIndex = ++curDiffIndex % diffs.length      
    }

    window.setTimeout(function(){ updateFalling(curDiffIndex) }, 5500)
  }

  updateFalling(1)

})();
