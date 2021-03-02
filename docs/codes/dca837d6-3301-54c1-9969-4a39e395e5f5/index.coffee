obj =
    num: 15
    func: ->
        console.log @num
        setTimeout =>
        #setTimeout ->
            #alert @num
            return
        ,1000
            
        
do obj.func

str = "私は#{obj.num}歳です"

alert str


# ドットが二つの場合は、末尾の数字も含んだ配列になる
b = [0..10]
c = [0...10]