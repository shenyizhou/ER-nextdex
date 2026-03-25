import { gameData } from "../data_version.js"
import { search } from "../search.js"
import { queryFilter2, longClickToFilter, trickFilterSearch, queryFilter3} from "../filters.js"
import { AisInB, e, JSHAC } from "../utils.js"
import { createInformationWindow, removeInformationWindow } from "../window.js"
import { setAllMoves, setMoveName, setMovePower, setMoveRow, setSplitMove } from "./species/species_panel.js"
import { getHintInteractibilityClass } from "../settings.js"

export let matchedMoves
let currentMoveID = 0

const splitIconMap = {
    物理: "PHYSICAL",
    特殊: "SPECIAL",
    变化: "STATUS",
    取最高攻击: "PHYSICAL",
    取最高伤害: "SPECIAL",
    攻击防御: "HITS_DEF",
    攻击特防: "HITS_SPDEF",
    PHYSICAL: "PHYSICAL",
    SPECIAL: "SPECIAL",
    STATUS: "STATUS",
    USE_HIGHEST_OFFENSE: "PHYSICAL",
    USE_HIGHEST_DAMAGE: "SPECIAL",
    HITS_DEF: "HITS_DEF",
    HITS_SPDEF: "HITS_SPDEF",
}

function getSplitIconKey(splitID){
    const split = gameData.splitT[splitID]
    return splitIconMap[split] || "STATUS"
}

export function feedPanelMoves(moveID) {
    currentMoveID = moveID
    const move = gameData.moves[moveID]
    $('#moves-name').text(move.name)
    $('#moves-internal-id').text(`ID: ${move.id}`)
    $('#moves-pwr').text(move.pwr ? move.pwr == 1 ? "?" : move.pwr : "--")
    $('#moves-acc').text(move.acc)
    $('#moves-chance').text(move.chance)
    $('#moves-pp').text(move.pp)
    $('#moves-prio').text(move.prio)
    setTarget(move.target)
    $('#moves-split').attr("src", `./icons/${getSplitIconKey(move.split)}.png`);
    $('#moves-split')[0].dataset.split = gameData.splitT[move.split].toLowerCase()
    //$('#moves-types').text('' + move.types.map((x)=>gameData.typeT[x]).join(' '))
    setTypes(move.types)
    $('#moves-desc').text(move.lDesc) //TODO fix the width of this
    listMoveFlags(move.flags.map((x) => gameData.flagsT[x]).concat(gameData.effT[move.eff]), $('#moves-flags'))

    $('#moves-list').find('.sel-active').addClass("sel-n-active").removeClass("sel-active")
    $('#moves-list').children().eq(moveID - 1).addClass("sel-active").removeClass("sel-n-active")
}

function setTypes(types) {
    for (let i = 0; i < 2; i++) {
        const type = gameData.typeT[types[i]] || ""
        $(`#moves-types${i + 1}`).attr("class", `type ${type.toLowerCase()} ${getHintInteractibilityClass()}`)
            .children().text(type)
    }
}
const flagMap = {
    "Makes Contact": "接触类招式",
    "Kings Rock Affected": "可触发王者之证",
    "High Crit": "容易击中要害",
    "Iron Fist Boost": "受铁拳加成",
    "Sheer Force Boost": "受强行加成",
    "Keen Edge Boost": "受利刃加成",
    "Air Based": "受巨翼加成",
    "Snatch Affected": "可被抢夺",
    "Dance": "舞蹈招式",
    "Always Crit": "必定击中要害",
    "Field Based": "受场地探索者加成",
    "Striker Boost": "受打击者加成",
    "Two Strikes": "攻击两次",
    "Reckless Boost": "受舍身加成",
    "Magic Coat Affected": "受魔法反射影响",
    "Horn Based": "受强角加成",
    "Strong Jaw Boost": "受强颚加成",
    "Sound": "声音招式",
    "Mega Launcher Boost": "受超级发射器加成",
    "Ballistic": "弹道招式",
    "Dmg Underwater": "可命中潜水目标",
    "Weather Based": "随天气变化",
    "Powder": "粉末招式",
    "Dmg In Air": "可命中空中目标",
    "Dmg Underground": "可命中地下目标",
    "Bone Based": "骨系招式",
    "Dmg Ungrounded Ignore Type If Flying": "",
    "Thaw User": "可解除自身冰冻",
    "Protection Move": "保护类招式",
    "Dmg 2x In Air": "对空中目标伤害翻倍",
    "Stat Stages Ignored": "无视能力变化",
    "Hit In Substitute": "可穿透替身",
    "Target Ability Ignored": "无视目标特性",
    "FrostBite Hit": "可能造成冻伤",
    "Burn Hit": "可能造成灼伤",
    "Sleep": "可能造成睡眠",
    "Confuse": "可能造成混乱",
    "Confuse Hit": "可能造成混乱",
    "Paralyze": "可能造成麻痹",
    "Flinch Hit": "可能造成畏缩",
    "Attack Down Hit": "可能降低攻击",
    "Defense Down Hit": "可能降低防御",
    "Special Attack Down Hit": "可能降低特攻",
    "Special Defense Down Hit": "可能降低特防",
    "Speed Down Hit": "可能降低速度",
    "Attack Down Hit 2": "可能大幅降低攻击",
    "Defense Down Hit 2": "可能大幅降低防御",
    "Special Attack Down Hit 2": "可能大幅降低特攻",
    "Special Defense Down Hit 2": "可能大幅降低特防",
    "Speed Down Hit 2": "可能大幅降低速度",
    "Protect Affected": "受守住影响",
    "Mirror Move Affected": "可被鹦鹉学舌",
    "Technician": "技术高手",
    "Perfectionnist": "完美主义",
    "High Crit Rate": "高要害率",
    "Air/Wing Based": "飞翼类招式",
    "Dance Move": "舞蹈招式",
    "Always Crits": "必定击中要害",
    "Hammer Based": "锤击类招式",
    "Kick Based": "踢击类招式",
    "Causes Recoil": "会造成反作用力伤害",
    "Drill Based": "钻击类招式",
    "Sound Based": "声音招式",
    "Bullet Move": "弹丸类招式",
    "Throw Based": "投掷类招式",
    "Lunar Move": "月亮类招式",
    "Arrow Based": "箭矢类招式"
}
/* window.debugMoveFlags = ()=>{
    const list =  {}
    gameData.moves.forEach(x => {
        for (const flagID of x.flags){
            const flag = gameData.flagsT[flagID]
            if (!flagMap[flag]){
                if (!list[flag]){
                    list[flag] = flag
                }
            }
            
        }
    })
    console.log(JSON.stringify(list, null, 4))
} */
function listMoveFlags(flags, core, longClickCallback = ()=>{}) {
    const frag = document.createDocumentFragment()
    for (const flag of flags) {
        let descFlag = flagMap[flag]
        if (!descFlag) {
            descFlag = flag
            continue
        }
        const node = e("div", getHintInteractibilityClass(), descFlag)
        longClickToFilter(2, node, "move-effect", () => {return flag}, longClickCallback)
        frag.append(node)
    }
    core.empty()
    core.append(frag)
}

function setTarget(targetID) {
    const target = gameData.targetT[targetID]
    const targetMap = ["foe1", "foe2", "foe3", "ally1", "allySelf", "ally2"]
    const colorMap = {
        "SELECTED": [0, 1, 0, 0, 0, 0],
        "BOTH": [0, 1, 0, 0, 1, 0],
        "USER": [0, 0, 0, 0, 1, 0],
        "RANDOM": [2, 2, 2, 2, 0, 2], // how do i communicate the randomly?
        "FOES_AND_ALLY": [1, 1, 1, 1, 0, 1],
        "DEPENDS": [2, 2, 2, 0, 0, 0], //
        "ALL_BATTLERS": [1, 1, 1, 1, 1, 1],
        "OPPONENTS_FIELD": [1, 1, 1, 0, 0, 0],
        "ALLY": [0, 0, 0, 1, 0, 1],
        "USER_OR_ALLY": [0, 0, 0, 1, 1, 1]
    }[target]
    if (!colorMap){
        console.warn('a new target has been added, please update this code')
        return
    }
    const colorCode = ["unset", "#f4072a", "#c74fef"]
    for (const i in targetMap) {
        const nodeTarget = $("#" + targetMap[i])
        const colorID = colorMap[i]
        nodeTarget.css('background-color', colorCode[colorID])
    }
}

export function setupMoves(){
    $('#moves-types1, moves-types2').each((index, node)=>{
        longClickToFilter(2, node, "type", ()=>{return node.children[0].innerText})
    })
    longClickToFilter(2, $('#moves-split').parent()[0], "category", 
            ()=>{ return $('#moves-split')[0].dataset.split || ""}
        )
    
}

export function redirectMove(moveId) {
    search.callbackAfterFilters = () => {
        $('#moves-list').children().eq(moveId - 1).click()[0].scrollIntoView({ behavior: "smooth" })
    }
    $("#btn-moves").click()

}


export function moveOverlay(moveId, interactive=true) {
    const triggerMoveRefresh = ()=>{
        trickFilterSearch(2)
        setAllMoves()
    }
    const move = gameData.moves[moveId]
    const core = e("div", "move-overlay")
    const power = e("div", "move-overlay-power")
    const powerTitle = e("div", "move-overlay-top " + getHintInteractibilityClass(), move.name)
    
    
    const powerNumber = e("div", "move-overlay-fill", move.pwr || "?")
    const stats = e("div", "move-overlay-stats")
    const statsAcc = e("div", "move-overlay-acc", `命中：${move.acc || "--"}`)
    const statsPP = e("div", "move-overlay-pp", `PP：${move.pp}`)
    const statsPrio = e("div", "move-overlay-prio", `优先度：${move.prio}`)
    const statsChance = e("div", "move-overlay-chance", `追加概率：${move.chance}`)
    const otherInfos = e("div", "move-overlay-other")
    const typeDiv = e("div", "move-overlay-types")
    const type1 = gameData.typeT[move.types[0]]
    const type1Div = e("div", `move-overlay-type ${type1.toLowerCase()} ${getHintInteractibilityClass()}`, type1)
    
    const type2 = move.types[1] ? gameData.typeT[move.types[1]] : ""
    const type2Div = e("div", `move-overlay-type ${type2.toLowerCase()} ${getHintInteractibilityClass()}`, type2)
    
    const splitDiv = e('div', getHintInteractibilityClass())
    const split = e("img", "move-overlay-img pixelated")
    split.src = `./icons/${getSplitIconKey(move.split)}.png`
    
    const effectsDiv = e("div", "move-overlay-effects")
    listMoveFlags(move.flags.map((x) => gameData.flagsT[x]).concat(gameData.effT[move.eff]), $(effectsDiv), interactive?triggerMoveRefresh:null)
    if (interactive){
        powerTitle.onclick = (ev) => {
        removeInformationWindow(ev)
            redirectMove(moveId)
        }
        longClickToFilter(0, powerTitle, "Move", undefined)
        longClickToFilter(2, type1Div, "type", undefined, triggerMoveRefresh)
        longClickToFilter(2, type2Div, "type", undefined, triggerMoveRefresh)
        longClickToFilter(2, splitDiv, "category", 
            ()=>{ return gameData.splitT[move.split].toLowerCase() || ""}
        , triggerMoveRefresh)
    }
    return JSHAC([
        core, [
            power, [
                powerTitle,
                powerNumber,
            ],
            stats, [
                statsAcc,
                statsPP,
                statsPrio,
                statsChance
            ],
            otherInfos, [
                typeDiv, [
                    type1Div,
                    type2Div,
                ],
                splitDiv, [
                    split
                ]
            ],
            effectsDiv
        ]
    ])
}

export function clearMatchedMove(){
    matchedMoves = false
}

const prefixTree = {
    treeId: "moves"
}
export function buildMovesPrefixTrees(){
    prefixTree.name = {}
    prefixTree.type = {}
    gameData.moves.forEach((move, i)=>{
        const namePrefix = move.name.charAt(0)
        if (!prefixTree.name[namePrefix]) prefixTree.name[namePrefix] = []
        prefixTree.name[prefix].push({data: i, suggestions: move.name})
        move.types.forEach(pokeTypeId => {
            const typeName = gameData.typeT[pokeTypeId].toLowerCase()
            const typePrefix = typeName.charAt(0)
            if (!prefixTree.type[typePrefix]) prefixTree.type[typePrefix] = []
            prefixTree.type[typePrefix].push({data: i, suggestions: typeName})
        })
    })
}


export const queryMapMoves = {
    "name": (queryData, move) => {
        const moveName = move.name.toLowerCase()
        const desc = move.lDesc.toLowerCase()
        if (AisInB(queryData, moveName) || AisInB(queryData, desc)) {
            return [moveName === queryData, moveName, true]
        }
        return false
    },
    "move": (queryData, move) => {
        const moveName = move.name.toLowerCase()
        const desc = move.lDesc.toLowerCase()
        if (AisInB(queryData, moveName) || AisInB(queryData, desc)) {
            return [moveName === queryData, moveName, true]
        }
        return false
    },
    "type": (queryData, move) => {
        const types = move.types.map((x) => gameData.typeT[x].toLowerCase())
        for (const type of types) {
            if (AisInB(queryData, type)) return type
        }
        return false
    },
    "move-effect": (queryData, move) => {
        //it's called effect but in the data it's flags not effect
        //effect in the data might be useless to the dex, at least to short and medium terms
        const flags = move.flags.map((x) => gameData.flagsT[x].toLowerCase())
        const effAsFlag = gameData.effT[move.eff]
        if (effAsFlag) flags.push(effAsFlag.toLowerCase())
        for (const flag of flags) {
            if (AisInB(queryData, flag)) return flag
        }
        return false
    },
    "category": (queryData, move) => {
        const moveSplit = gameData.splitT[move.split].toLowerCase()
        if (AisInB(queryData, moveSplit)){
            return moveSplit
        }
    },
    "prio": (queryData, move) => {
        return queryData == move.prio
    },
    "<prio": (queryData, move) => {
        return  move.prio < queryData
    },
    "<=prio": (queryData, move) => {
        return  move.prio <= queryData 
    },
    ">prio": (queryData, move) => {
        return  move.prio > queryData
    },
    ">=prio": (queryData, move) => {
        return  move.prio >= queryData
    },
    "acc": (queryData, move) => {
        return move.acc && queryData == move.acc
    },
    "<acc": (queryData, move) => {
        return  move.acc && move.acc < queryData
    },
    "<=acc": (queryData, move) => {
        return  move.acc && move.acc <= queryData 
    },
    ">acc": (queryData, move) => {
        return  move.acc && move.acc > queryData
    },
    ">=acc": (queryData, move) => {
        return  move.acc && move.acc >= queryData
    },
    "target": (queryData, move) => {
        const target = gameData.targetT[move.target].toLowerCase()
        if (AisInB(queryData, target)){
            return target
        }
        return false
    },
    "power": (queryData, move) => {
        return move.pwr && queryData == move.pwr
    },
    "<power": (queryData, move) => {
        return  move.pwr && move.pwr < queryData
    },
    "<=power": (queryData, move) => {
        return  move.pwr && move.pwr <= queryData 
    },
    ">power": (queryData, move) => {
        return  move.pwr && move.pwr > queryData
    },
    ">=power": (queryData, move) => {
        return  move.pwr && move.pwr >= queryData
    },
}
export function updateMoves(searchQuery) {
    const moves = gameData.moves
    if (typeof searchQuery.data === "string"){
        const hOp = searchQuery.data?.match(/^[><=]+/)?.[0] //hidden operator
        if (hOp){
            searchQuery.data = searchQuery.data.replace(hOp, '')
            searchQuery.k = hOp + searchQuery.k
        }
    }
    const nodeList = $('#moves-list').children()
    matchedMoves = queryFilter3(searchQuery, moves, queryMapMoves, prefixTree)
    let validID;
    const movesLen = moves.length
    for (let i  = 0; i < movesLen; i++) {
        if (i == 0) continue
        const node = nodeList.eq(i - 1)
        if (!matchedMoves || matchedMoves.indexOf(i) != -1) {
            if (!validID) validID = i
            node.show()
        } else {
            node.hide()
        }
    }
    //if the current selection isn't in the list then change
    if (matchedMoves && matchedMoves.indexOf(currentMoveID) == -1 && validID) feedPanelMoves(validID)
}
