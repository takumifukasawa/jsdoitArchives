# 変数宣言のvarいらない

# semicolonでワンライナー連結
#console.log "hoge"; console.log "fuga";

# 右から読みこまれる
#console.log Math.pow 2, 2

# is === ===
# not === !
# unless === if !

###

# var myFunction = function(arg){};
myFunction = (arg) ->
    #if arg is 'hoge'
    #if arg isnt 'hoge'

    # 後置if
    #alert arg if arg isnt 'hoge'
    alert 'false' unless arg
    alert 'false' if not arg
    true

# funcの最後のものをreturnする仕様がある
# それを利用して、最後にtrueをかけば、trueが帰る

myFunction false 


a = 1
b = 2


# 三項演算子
# c = a === b ? 3 : 4
c = if a is b then 3 else 4
alert c

obj =
    b: 'c'
    d: 'e'
    
arr = [
    1
    2
    3
    4
    ]

###


$ '.myDiv'
    .hide()