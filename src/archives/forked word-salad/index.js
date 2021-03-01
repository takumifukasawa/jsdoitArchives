// forked from fayird's "forked: word-salad" http://jsdo.it/fayird/cYpS
// forked from Biske's "word-salad" http://jsdo.it/Biske/8M4M
const sentence = "半年のうちに世相は変った。のといでたつ我は。大君のへにこそ死なめかへりみはせじ。若者達は花と散ったが、同じ彼等が生き残ってとなる。ももとせの命ねがはじいつの日か御楯とゆかん君とちぎりて。けなげな心情で男を送った女達も半年の月日のうちに夫君のにぬかずくことも事務的になるばかりであろうし、やがて新たな面影を胸に宿すのも遠い日のことではない。人間が変ったのではない。人間は元来そういうものであり、変ったのは世相の上皮だけのことだ。"
const dots = []
const dots_count = sentence.length
const container = document.getElementById("container")

for(let i=0; i<sentence.length; i++){
    let dot = document.createElement("div")
    dot.classList.add("dot")
    dot.style.transform = `scale(${1 + i * 0.01})`
    dot.textContent = sentence[i]
    dots.push(dot)
}

dots.forEach(dot => {
    container.appendChild(dot);
})

const a = 4.5 // アルキメデスの螺旋のパラメータ
const offset = 5

function mod(i, j) {
    return (i % j) < 0 ? (i % j) + 0 + (j < 0 ? -j : j) : (i % j + 0);
}

function scale(s) {
    // s * s の項は調整用
    return  1;
}

function distance(s) {
    return  s * 20 * 2;
}

function radius(angle, s) {
    // s * s の項は調整用
    return angle * a;
}

function update(t) {
    //console.log(t);
    dots.forEach((dot, i) => {
        // 参考リンク
        // http://examist.jp/mathematics/sum-volume-length2/archimedes-spiral/
        // http://www.geisya.or.jp/~mwm48961/electro/integral_length1_m2_12.htm
                 
        const s = offset + mod(i + t * 0.001, dots_count)
        
        // 中心からの距離[px]
        //const d = i * 20 * 2
        const d = distance(s)
        
        // 角度[rad]の近似（0付近じゃなければ大体あってる）
        const angle = Math.sqrt(d / a)
        
        // 半径[px]
        const r = radius(angle, s)
        
        // 描画
        const x = Math.cos(angle) * r
        const y = Math.sin(angle) * r
        dot.style.transform = `
            translate(${x}px, ${y}px)
            translate(-50%, -50%)
            scale(${scale(s)})
            rotate(${angle + Math.PI / 2}rad)
            `
        dot.style.opacity = (s - offset) / 10
    })
    
    requestAnimationFrame(update)
}
requestAnimationFrame(update)