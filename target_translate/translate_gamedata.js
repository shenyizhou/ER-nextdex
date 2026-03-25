"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const typeMap = {
    Normal: "一般",
    Fighting: "格斗",
    Fire: "火",
    Ice: "冰",
    Electric: "电",
    Bug: "虫",
    Flying: "飞行",
    Steel: "钢",
    Grass: "草",
    Ground: "地面",
    Poison: "毒",
    Dark: "恶",
    Water: "水",
    Psychic: "超能力",
    Rock: "岩石",
    Dragon: "龙",
    Ghost: "幽灵",
    Fairy: "妖精",
    Stellar: "星晶",
    Mystery: "神秘",
    None: "无"
};
const splitMap = {
    PHYSICAL: "物理",
    SPECIAL: "特殊",
    STATUS: "变化",
    USE_HIGHEST_OFFENSE: "取最高攻击",
    HITS_DEF: "攻击防御",
    USE_HIGHEST_DAMAGE: "取最高伤害",
    HITS_SPDEF: "攻击特防"
};
const targetMap = {
    SELECTED: "选中目标",
    BOTH: "双方目标",
    USER: "使用者",
    RANDOM: "随机目标",
    FOES_AND_ALLY: "对手与队友",
    DEPENDS: "视情况而定",
    ALL_BATTLERS: "全场战斗者",
    OPPONENTS_FIELD: "对手场地",
    ALLY: "队友",
    USER_OR_ALLY: "使用者或队友"
};
const eggGroupMap = {
    EGG_GROUP_MONSTER: "怪兽组",
    EGG_GROUP_GRASS: "植物组",
    EGG_GROUP_DRAGON: "龙组",
    EGG_GROUP_WATER_1: "水中1组",
    EGG_GROUP_BUG: "虫组",
    EGG_GROUP_FLYING: "飞行组",
    EGG_GROUP_FIELD: "陆上组",
    EGG_GROUP_UNDISCOVERED: "未发现组",
    EGG_GROUP_FAIRY: "妖精组",
    EGG_GROUP_HUMAN_LIKE: "人形组",
    EGG_GROUP_WATER_3: "水中3组",
    EGG_GROUP_MINERAL: "矿物组",
    EGG_GROUP_AMORPHOUS: "不定形组",
    EGG_GROUP_WATER_2: "水中2组",
    EGG_GROUP_DITTO: "百变怪组"
};
const colorMap = {
    RED: "红色",
    GREEN: "绿色",
    BLUE: "蓝色",
    WHITE: "白色",
    BROWN: "棕色",
    YELLOW: "黄色",
    PURPLE: "紫色",
    PINK: "粉色",
    GRAY: "灰色",
    BLACK: "黑色"
};
const evoKindMap = {
    EVO_LEVEL: "等级进化",
    EVO_MEGA_EVOLUTION: "超级进化",
    EVO_PRIMAL_REVERSION: "原始回归",
    EVO_LEVEL_MALE: "雄性等级进化",
    EVO_LEVEL_FEMALE: "雌性等级进化",
    EVO_MOVE_MEGA_EVOLUTION: "招式触发超级进化"
};
const scriptedEncounterMap = {
    "scripted wild": "脚本野生遭遇",
    "scripted not wild": "脚本非野生遭遇",
    "given with custom moves": "自带招式赠送",
    given: "赠送"
};
const natureMap = {
    Hardy: "勤奋",
    Lonely: "怕寂寞",
    Brave: "勇敢",
    Adamant: "固执",
    Naughty: "顽皮",
    Bold: "大胆",
    Docile: "坦率",
    Relaxed: "悠闲",
    Impish: "淘气",
    Lax: "乐天",
    Timid: "胆小",
    Hasty: "急躁",
    Serious: "认真",
    Jolly: "爽朗",
    Naive: "天真",
    Modest: "内敛",
    Mild: "慢吞吞",
    Quiet: "冷静",
    Bashful: "害羞",
    Rash: "马虎",
    Calm: "温和",
    Gentle: "温顺",
    Sassy: "自大",
    Careful: "慎重",
    Quirky: "浮躁"
};
const exactTermMap = {
    Pokémon: "宝可梦",
    pokemon: "宝可梦",
    foe: "对手",
    foes: "对手方",
    enemy: "敌方",
    enemies: "敌方",
    target: "目标",
    targets: "目标",
    user: "使用者",
    ally: "我方",
    allies: "我方",
    self: "自身",
    partner: "搭档",
    HP: "HP",
    PP: "PP",
    Attack: "攻击",
    Defense: "防御",
    "Sp. Atk": "特攻",
    "Sp. Def": "特防",
    Special: "特殊",
    Speed: "速度",
    accuracy: "命中率",
    evasiveness: "闪避率",
    flinch: "畏缩",
    confusion: "混乱",
    confused: "混乱",
    poison: "中毒",
    poisoned: "中毒",
    badly: "剧毒",
    burn: "灼伤",
    burned: "灼伤",
    freeze: "冰冻",
    frozen: "冰冻",
    frostbite: "冻伤",
    paralyze: "麻痹",
    paralyzed: "麻痹",
    paralysis: "麻痹",
    sleep: "睡眠",
    asleep: "睡眠",
    recoil: "反作用力伤害",
    recoiling: "反作用力伤害",
    terrain: "场地",
    weather: "天气",
    sunlight: "日照",
    rain: "下雨",
    hail: "冰雹",
    sandstorm: "沙暴",
    item: "道具",
    items: "道具",
    move: "招式",
    moves: "招式",
    Ability: "特性",
    ability: "特性",
    abilities: "特性",
    switches: "替换",
    switched: "替换",
    critical: "要害",
    physical: "物理",
    status: "变化",
    contact: "接触",
    seed: "种子"
};
const regexReplacements = [
    [/\b([A-Z][a-z]+)-type\b/g, (_substring, match) => `${typeMap[match] || match}属性`],
    [/\b([A-Z][a-z]+) types\b/g, (_substring, match) => `${typeMap[match] || match}属性`],
    [/\b([A-Z][a-z]+) type\b/g, (_substring, match) => `${typeMap[match] || match}属性`],
    [/\b10% chance\b/g, "10% 概率"],
    [/\b20% chance\b/g, "20% 概率"],
    [/\b30% chance\b/g, "30% 概率"],
    [/\b40% chance\b/g, "40% 概率"],
    [/\b50% chance\b/g, "50% 概率"],
    [/\bhigh critical-hit ratio\b/gi, "高要害率"],
    [/\bcritical-hit ratio\b/gi, "要害率"],
    [/\bone-hit KO\b/gi, "一击必杀"],
    [/\bheld item\b/gi, "携带道具"],
    [/\bstat stages\b/gi, "能力等级"],
    [/\bstat stage\b/gi, "能力等级"],
    [/\bturns\b/gi, "回合"],
    [/\bturn\b/gi, "回合"],
    [/\bpower points\b/gi, "PP"],
    [/\bnever misses\b/gi, "不会落空"],
    [/\bcannot miss\b/gi, "不会落空"],
    [/\bmay cause\b/gi, "可能使"],
    [/\bhas a\b/gi, "有"],
    [/\bchance to\b/gi, "概率使"],
    [/\bused on\b/gi, "作用于"],
    [/\bused by\b/gi, "由…使用"],
    [/\blevels?\b/gi, "等级"],
    [/\blowers\b/gi, "降低"],
    [/\braises\b/gi, "提升"],
    [/\brestores\b/gi, "回复"],
    [/\brecovers\b/gi, "回复"],
    [/\bheals\b/gi, "回复"],
    [/\bcauses\b/gi, "造成"],
    [/\bprevents\b/gi, "阻止"],
    [/\bboosts\b/gi, "提升"],
    [/\bincreases\b/gi, "提高"],
    [/\breduces\b/gi, "降低"]
];
function printHelpAndExit() {
    console.log([
        "用法:",
        "  npm run translate-gamedata -- --input static/js/data/gameData.json --output out/gameData.zh.json",
        "",
        "参数:",
        "  --input <path>       输入 JSON 文件",
        "  --output <path>      输出 JSON 文件",
        "  --cache <path>       翻译缓存文件",
        "  --glossary <path>    自定义术语表 JSON",
        "  --template <path>    输出未翻译专有名词模板 JSON",
        "  --report <path>      输出翻译报告 JSON",
        "  --provider <mode>    glossary、google 或 openai",
        "  --limit <number>     仅处理前 N 个字符串，便于测试",
        "  --dry-run            只执行流程，不写输出文件",
        "",
        "默认术语表:",
        "  src/translate_gamedata.glossary.json",
        "",
        "环境变量:",
        "  OPENAI_API_KEY",
        "  OPENAI_BASE_URL",
        "  OPENAI_MODEL"
    ].join("\n"));
    process.exit(0);
}
function parseArgs(argv) {
    const input = path.resolve("static/js/data/gameData.json");
    const output = path.resolve("static/js/data/gameData.zh.json");
    const cache = path.resolve("out/gameData.zh.cache.json");
    const defaultGlossary = path.resolve("src/translate_gamedata.glossary.json");
    const baseOptions = {
        input,
        output,
        cache,
        glossary: fs.existsSync(defaultGlossary) ? defaultGlossary : undefined,
        template: undefined,
        report: undefined,
        provider: process.env.OPENAI_API_KEY ? "openai" : "google",
        limit: Number.POSITIVE_INFINITY,
        dryRun: false,
        model: process.env.OPENAI_MODEL,
        baseUrl: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
        apiKey: process.env.OPENAI_API_KEY
    };
    for (let index = 2; index < argv.length; index++) {
        const arg = argv[index];
        const next = argv[index + 1];
        if (arg === "--help" || arg === "-h")
            printHelpAndExit();
        if (arg === "--dry-run") {
            baseOptions.dryRun = true;
            continue;
        }
        if (!next)
            throw new Error(`${arg} 缺少参数值`);
        if (arg === "--input")
            baseOptions.input = path.resolve(next);
        else if (arg === "--output")
            baseOptions.output = path.resolve(next);
        else if (arg === "--cache")
            baseOptions.cache = path.resolve(next);
        else if (arg === "--glossary")
            baseOptions.glossary = path.resolve(next);
        else if (arg === "--template")
            baseOptions.template = path.resolve(next);
        else if (arg === "--report")
            baseOptions.report = path.resolve(next);
        else if (arg === "--provider")
            baseOptions.provider = next;
        else if (arg === "--limit")
            baseOptions.limit = Number(next);
        else
            throw new Error(`未知参数: ${arg}`);
        index += 1;
    }
    if (baseOptions.provider !== "glossary" && baseOptions.provider !== "google" && baseOptions.provider !== "openai") {
        throw new Error(`不支持的 provider: ${baseOptions.provider}`);
    }
    if (!Number.isFinite(baseOptions.limit) || baseOptions.limit < 1) {
        baseOptions.limit = Number.POSITIVE_INFINITY;
    }
    if (!baseOptions.report) {
        baseOptions.report = `${baseOptions.output}.report.json`;
    }
    return baseOptions;
}
function createEmptyGlossary() {
    return {
        exact: {},
        species: {},
        abilities: {},
        abilityDescriptions: {},
        moves: {},
        moveDescriptions: {},
        items: {},
        maps: {},
        trainerClasses: {},
        trainers: {},
        regex: []
    };
}
async function readJsonIfExists(filePath, fallback) {
    if (!filePath)
        return fallback;
    if (!fs.existsSync(filePath))
        return fallback;
    return JSON.parse(await fs.promises.readFile(filePath, "utf8"));
}
function isAsciiWordChar(char) {
    return !!char && /[A-Za-z0-9]/.test(char);
}
function replaceWholeToken(text, search, replacement) {
    let currentIndex = 0;
    let output = "";
    while (currentIndex < text.length) {
        const foundIndex = text.toLowerCase().indexOf(search.toLowerCase(), currentIndex);
        if (foundIndex === -1) {
            output += text.slice(currentIndex);
            break;
        }
        const before = text[foundIndex - 1];
        const after = text[foundIndex + search.length];
        const bounded = !isAsciiWordChar(before) && !isAsciiWordChar(after);
        output += text.slice(currentIndex, foundIndex);
        output += bounded ? replacement : text.slice(foundIndex, foundIndex + search.length);
        currentIndex = foundIndex + search.length;
    }
    return output;
}
function getDomain(pathParts) {
    const root = pathParts[0];
    const tail = pathParts[pathParts.length - 1];
    if (root === "abilities" && tail === "name")
        return "ability_name";
    if (root === "abilities" && tail === "desc")
        return "ability_desc";
    if (root === "moves" && tail === "name")
        return "move_name";
    if (root === "moves" && tail === "sName")
        return "move_short_name";
    if (root === "moves" && tail === "desc")
        return "move_desc";
    if (root === "moves" && tail === "lDesc")
        return "move_long_desc";
    if (root === "species" && tail === "name")
        return "species_name";
    if (root === "species" && tail === "desc")
        return "species_desc";
    if (root === "items" && tail === "name")
        return "item_name";
    if (root === "mapsT")
        return "map_name";
    if (root === "trainers" && tail === "name")
        return "trainer_name";
    if (root === "tclassT")
        return "trainer_class";
    if (root === "typeT")
        return "type_name";
    if (root === "targetT")
        return "target_name";
    if (root === "flagsT")
        return "flag_name";
    if (root === "effT")
        return "effect_name";
    if (root === "splitT")
        return "split_name";
    if (root === "eggT")
        return "egg_group";
    if (root === "growT")
        return "growth_name";
    if (root === "colT")
        return "color_name";
    if (root === "evoKindT")
        return "evo_kind";
    if (root === "natureT")
        return "nature_name";
    if (root === "scriptedEncoutersHowT")
        return "scripted_encounter";
    return "generic";
}
function getDomainGlossary(domain, glossary) {
    if (domain === "species_name")
        return glossary.species || {};
    if (domain === "ability_name")
        return glossary.abilities || {};
    if (domain === "move_name" || domain === "move_short_name")
        return glossary.moves || {};
    if (domain === "item_name")
        return glossary.items || {};
    if (domain === "map_name")
        return glossary.maps || {};
    if (domain === "trainer_class")
        return glossary.trainerClasses || {};
    if (domain === "trainer_name")
        return glossary.trainers || {};
    return glossary.exact || {};
}
function getBuiltinExactForDomain(domain) {
    if (domain === "type_name")
        return typeMap;
    if (domain === "target_name")
        return targetMap;
    if (domain === "split_name")
        return splitMap;
    if (domain === "egg_group")
        return eggGroupMap;
    if (domain === "color_name")
        return colorMap;
    if (domain === "evo_kind")
        return evoKindMap;
    if (domain === "nature_name")
        return natureMap;
    if (domain === "scripted_encounter")
        return scriptedEncounterMap;
    return {};
}
function applyDeterministicTranslation(text, domain, glossary) {
    let translated = text;
    const domainGlossary = getDomainGlossary(domain, glossary);
    const exactMatch = domainGlossary[text] || getBuiltinExactForDomain(domain)[text] || glossary.exact?.[text];
    if (exactMatch) {
        return {
            text: exactMatch,
            changed: exactMatch !== text,
            needsRemote: false
        };
    }
    const builtinDomainMap = getBuiltinExactForDomain(domain);
    if (Object.keys(builtinDomainMap).length) {
        return {
            text,
            changed: false,
            needsRemote: false
        };
    }
    const replaceTerms = {
        ...exactTermMap,
        ...(glossary.exact || {}),
        ...domainGlossary
    };
    const sortedTerms = Object.entries(replaceTerms).sort((left, right) => right[0].length - left[0].length);
    for (const [search, replacement] of sortedTerms) {
        translated = replaceWholeToken(translated, search, replacement);
    }
    translated = translated.replace(/\b([A-Z][a-z]+)-type\b/g, (_substring, match) => `${typeMap[match] || match}属性`);
    translated = translated.replace(/\b([A-Z][a-z]+) types\b/g, (_substring, match) => `${typeMap[match] || match}属性`);
    translated = translated.replace(/\b([A-Z][a-z]+) type\b/g, (_substring, match) => `${typeMap[match] || match}属性`);
    for (const [pattern, replacement] of regexReplacements) {
        if (typeof replacement === "string") {
            translated = translated.replace(pattern, replacement);
        }
        else {
            translated = translated.replace(pattern, replacement);
        }
    }
    for (const entry of glossary.regex || []) {
        translated = translated.replace(new RegExp(entry.pattern, entry.flags || "g"), entry.replacement);
    }
    const changed = translated !== text;
    const needsRemote = /[A-Za-z]{2,}/.test(translated);
    return {
        text: translated,
        changed,
        needsRemote
    };
}
function buildCacheKey(domain, text) {
    return `${domain}\n${text}`;
}
function ensureSet(record, key) {
    if (!record[key])
        record[key] = new Set();
    return record[key];
}
function markUnresolved(domain, text, state) {
    if (!text.trim())
        return;
    if (domain === "species_name")
        ensureSet(state.unresolvedNames, "species").add(text);
    else if (domain === "ability_name")
        ensureSet(state.unresolvedNames, "abilities").add(text);
    else if (domain === "move_name" || domain === "move_short_name")
        ensureSet(state.unresolvedNames, "moves").add(text);
    else if (domain === "item_name")
        ensureSet(state.unresolvedNames, "items").add(text);
    else if (domain === "map_name")
        ensureSet(state.unresolvedNames, "maps").add(text);
    else if (domain === "trainer_class")
        ensureSet(state.unresolvedNames, "trainerClasses").add(text);
    else if (domain === "trainer_name")
        ensureSet(state.unresolvedNames, "trainers").add(text);
}
function addPending(entry, state) {
    const existing = state.pendingByKey.get(entry.cacheKey);
    if (existing) {
        existing.push(entry);
    }
    else {
        state.pendingByKey.set(entry.cacheKey, [entry]);
    }
    state.stats.pending += 1;
}
function translateNode(node, pathParts, parent, key, state) {
    if (typeof node === "string") {
        state.stats.scannedStrings += 1;
        if (state.stats.scannedStrings > state.options.limit) {
            state.stats.unchanged += 1;
            return node;
        }
        const domain = getDomain(pathParts);
        if (pathParts[pathParts.length - 1] === "NAME") {
            state.stats.unchanged += 1;
            return node;
        }
        const translated = applyDeterministicTranslation(node, domain, state.glossary);
        if (!translated.needsRemote || state.options.provider === "glossary") {
            if (translated.changed)
                state.stats.changedByGlossary += 1;
            else
                state.stats.unchanged += 1;
            if (!translated.changed && /_/.test(node) === false) {
                markUnresolved(domain, node, state);
            }
            return translated.text;
        }
        if (parent === null || key === null)
            return translated.text;
        const cacheKey = buildCacheKey(domain, translated.text);
        const cached = state.cache[cacheKey];
        if (cached) {
            state.stats.changedByOpenAI += 1;
            return cached;
        }
        addPending({
            parent,
            key,
            text: translated.text,
            domain,
            contextPath: pathParts.join("."),
            cacheKey
        }, state);
        if (translated.changed)
            state.stats.changedByGlossary += 1;
        else
            markUnresolved(domain, node, state);
        return translated.text;
    }
    if (Array.isArray(node)) {
        return node.map((item, index) => translateNode(item, [...pathParts, String(index)], node, index, state));
    }
    if (node && typeof node === "object") {
        const output = {};
        for (const [childKey, childValue] of Object.entries(node)) {
            output[childKey] = translateNode(childValue, [...pathParts, childKey], output, childKey, state);
        }
        return output;
    }
    return node;
}
function buildGlossaryPrompt(glossary) {
    const sections = [];
    const merged = {
        ...typeMap,
        ...splitMap,
        ...eggGroupMap,
        ...colorMap,
        ...evoKindMap,
        ...scriptedEncounterMap,
        ...exactTermMap,
        ...(glossary.exact || {}),
        ...(glossary.species || {}),
        ...(glossary.abilities || {}),
        ...(glossary.moves || {}),
        ...(glossary.items || {}),
        ...(glossary.maps || {}),
        ...(glossary.trainerClasses || {}),
        ...(glossary.trainers || {})
    };
    const entries = Object.entries(merged).sort((left, right) => left[0].localeCompare(right[0])).slice(0, 400);
    for (const [source, target] of entries) {
        sections.push(`${source} => ${target}`);
    }
    return sections.join("\n");
}
function stripMarkdownFences(text) {
    return text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
}
async function translateBatchWithOpenAI(batch, options, glossary) {
    if (!options.apiKey)
        throw new Error("使用 openai provider 时必须提供 OPENAI_API_KEY");
    const response = await fetch(`${options.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${options.apiKey}`
        },
        body: JSON.stringify({
            model: options.model || "gpt-4o-mini",
            temperature: 0,
            messages: [
                {
                    role: "system",
                    content: [
                        "你是一个宝可梦术语本地化翻译器。",
                        "请把英文翻译成简体中文。",
                        "优先使用官方或常用中文宝可梦术语。",
                        "保持数字、缩写、变量、枚举、占位符和 JSON 结构不变。",
                        "已经是中文的内容不要改写。",
                        "请严格返回 JSON 数组，每项形如 {\"key\":\"...\",\"translation\":\"...\"}。",
                        "术语表如下：",
                        buildGlossaryPrompt(glossary)
                    ].join("\n")
                },
                {
                    role: "user",
                    content: JSON.stringify(batch)
                }
            ]
        })
    });
    if (!response.ok) {
        throw new Error(`OpenAI 接口请求失败: ${response.status} ${response.statusText}`);
    }
    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content;
    if (!content)
        throw new Error("OpenAI 返回为空");
    const normalized = stripMarkdownFences(content);
    const translatedEntries = JSON.parse(normalized);
    const result = {};
    for (const entry of translatedEntries) {
        result[entry.key] = entry.translation;
    }
    return result;
}
function loadGoogleTranslate() {
    const googleTranslateModule = require("google-translate-api-x");
    if (typeof googleTranslateModule === "function")
        return googleTranslateModule;
    if (googleTranslateModule.default)
        return googleTranslateModule.default;
    if (googleTranslateModule.translate)
        return googleTranslateModule.translate;
    throw new Error("无法加载 google-translate-api-x");
}
async function translateBatchWithGoogle(batch) {
    const translate = loadGoogleTranslate();
    const mapped = {};
    const safeTranslateSingle = async (text) => {
        try {
            const singleTranslated = await translate(text, {
                from: "en",
                to: "zh-CN",
                client: "gtx",
                forceBatch: false,
                fallbackBatch: false
            });
            const singleResult = Array.isArray(singleTranslated) ? singleTranslated[0] : singleTranslated;
            return singleResult?.text || text;
        }
        catch {
            return text;
        }
    };
    let results = [];
    try {
        const texts = batch.map((entry) => entry.text);
        const translated = await translate(texts, {
            from: "en",
            to: "zh-CN",
            client: "gtx",
            forceBatch: true,
            rejectOnPartialFail: false
        });
        results = Array.isArray(translated) ? translated : [translated];
    }
    catch {
        results = new Array(batch.length).fill(null);
    }
    for (let index = 0; index < batch.length; index++) {
        const batchResult = results[index];
        if (batchResult && batchResult.text) {
            mapped[batch[index].key] = batchResult.text;
            continue;
        }
        mapped[batch[index].key] = await safeTranslateSingle(batch[index].text);
    }
    return mapped;
}
function chunkPendingEntries(entries) {
    const chunks = [];
    let currentChunk = [];
    let currentLength = 0;
    for (const entry of entries) {
        const projected = currentLength + entry.text.length;
        if (currentChunk.length >= 20 || projected > 9000) {
            chunks.push(currentChunk);
            currentChunk = [];
            currentLength = 0;
        }
        currentChunk.push(entry);
        currentLength += entry.text.length;
    }
    if (currentChunk.length)
        chunks.push(currentChunk);
    return chunks;
}
async function flushPending(state) {
    const uniqueEntries = [...state.pendingByKey.entries()].map(([cacheKey, entries]) => {
        const first = entries[0];
        return {
            key: cacheKey,
            domain: first.domain,
            text: first.text
        };
    });
    if (!uniqueEntries.length)
        return;
    const translatedByKey = {};
    if (state.options.provider === "openai") {
        const chunks = chunkPendingEntries(uniqueEntries);
        for (const chunk of chunks) {
            const partial = await translateBatchWithOpenAI(chunk, state.options, state.glossary);
            Object.assign(translatedByKey, partial);
        }
    }
    else if (state.options.provider === "google") {
        const chunks = chunkPendingEntries(uniqueEntries);
        for (const chunk of chunks) {
            const partial = await translateBatchWithGoogle(chunk);
            Object.assign(translatedByKey, partial);
        }
    }
    for (const [cacheKey, entries] of state.pendingByKey.entries()) {
        const translated = translatedByKey[cacheKey] || entries[0].text;
        state.cache[cacheKey] = translated;
        for (const entry of entries) {
            ;
            entry.parent[entry.key] = translated;
        }
        if (translated !== entries[0].text)
            state.stats.changedByOpenAI += entries.length;
        else
            state.stats.unchanged += entries.length;
    }
}
function buildTemplate(state) {
    const template = {
        exact: {},
        species: {},
        abilities: {},
        moves: {},
        items: {},
        maps: {},
        trainerClasses: {},
        trainers: {}
    };
    for (const [domain, values] of Object.entries(state.unresolvedNames)) {
        const target = template[domain];
        if (!target)
            continue;
        for (const value of [...values].sort((left, right) => left.localeCompare(right))) {
            target[value] = "";
        }
    }
    return template;
}
function applyStructuredGlossaryOverrides(sourceData, translatedData, glossary) {
    const sourceAbilities = Array.isArray(sourceData.abilities) ? sourceData.abilities : [];
    const translatedAbilities = Array.isArray(translatedData.abilities) ? translatedData.abilities : [];
    for (let index = 0; index < Math.min(sourceAbilities.length, translatedAbilities.length); index++) {
        const sourceAbility = sourceAbilities[index];
        const translatedAbility = translatedAbilities[index];
        if (!sourceAbility || typeof sourceAbility !== "object" || Array.isArray(sourceAbility))
            continue;
        if (!translatedAbility || typeof translatedAbility !== "object" || Array.isArray(translatedAbility))
            continue;
        const sourceName = typeof sourceAbility.name === "string" ? sourceAbility.name : "";
        const glossaryName = glossary.abilities?.[sourceName];
        const glossaryDesc = glossary.abilityDescriptions?.[sourceName];
        if (glossaryName)
            translatedAbility.name = glossaryName;
        if (glossaryDesc)
            translatedAbility.desc = glossaryDesc;
    }
    const sourceMoves = Array.isArray(sourceData.moves) ? sourceData.moves : [];
    const translatedMoves = Array.isArray(translatedData.moves) ? translatedData.moves : [];
    for (let index = 0; index < Math.min(sourceMoves.length, translatedMoves.length); index++) {
        const sourceMove = sourceMoves[index];
        const translatedMove = translatedMoves[index];
        if (!sourceMove || typeof sourceMove !== "object" || Array.isArray(sourceMove))
            continue;
        if (!translatedMove || typeof translatedMove !== "object" || Array.isArray(translatedMove))
            continue;
        const sourceName = typeof sourceMove.name === "string" ? sourceMove.name : "";
        const glossaryName = glossary.moves?.[sourceName];
        const glossaryDesc = glossary.moveDescriptions?.[sourceName];
        if (glossaryName) {
            translatedMove.name = glossaryName;
            if (typeof translatedMove.sName === "string" && translatedMove.sName === sourceName) {
                translatedMove.sName = glossaryName;
            }
        }
        if (glossaryDesc && typeof translatedMove.desc === "string")
            translatedMove.desc = glossaryDesc;
    }
    const sourceSpecies = Array.isArray(sourceData.species) ? sourceData.species : [];
    const translatedSpecies = Array.isArray(translatedData.species) ? translatedData.species : [];
    for (let index = 0; index < Math.min(sourceSpecies.length, translatedSpecies.length); index++) {
        const sourceSpecie = sourceSpecies[index];
        const translatedSpecie = translatedSpecies[index];
        if (!sourceSpecie || typeof sourceSpecie !== "object" || Array.isArray(sourceSpecie))
            continue;
        if (!translatedSpecie || typeof translatedSpecie !== "object" || Array.isArray(translatedSpecie))
            continue;
        const sourceName = typeof sourceSpecie.name === "string" ? sourceSpecie.name : "";
        const glossaryName = glossary.species?.[sourceName];
        if (glossaryName)
            translatedSpecie.name = glossaryName;
    }
}
function buildReport(state, outputPath) {
    return {
        input: state.options.input,
        output: outputPath,
        provider: state.options.provider,
        scannedStrings: state.stats.scannedStrings,
        changedByGlossary: state.stats.changedByGlossary,
        changedByOpenAI: state.stats.changedByOpenAI,
        unchanged: state.stats.unchanged,
        pendingUnique: state.pendingByKey.size,
        unresolved: Object.fromEntries(Object.entries(state.unresolvedNames).map(([key, values]) => [key, [...values].sort((left, right) => left.localeCompare(right))]))
    };
}
async function ensureParentDirectory(filePath) {
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
}
async function main() {
    const options = parseArgs(process.argv);
    const glossary = await readJsonIfExists(options.glossary, createEmptyGlossary());
    const cache = await readJsonIfExists(options.cache, {});
    const rawInput = await fs.promises.readFile(options.input, "utf8");
    const sourceData = JSON.parse(rawInput);
    const state = {
        options,
        glossary,
        cache,
        pendingByKey: new Map(),
        unresolvedNames: {},
        stats: {
            scannedStrings: 0,
            changedByGlossary: 0,
            changedByOpenAI: 0,
            unchanged: 0,
            pending: 0
        }
    };
    const translatedData = translateNode(sourceData, [], null, null, state);
    await flushPending(state);
    applyStructuredGlossaryOverrides(sourceData, translatedData, glossary);
    const outputPath = options.output;
    const report = buildReport(state, outputPath);
    if (options.template) {
        await ensureParentDirectory(options.template);
        await fs.promises.writeFile(options.template, JSON.stringify(buildTemplate(state), null, 2), "utf8");
    }
    if (!options.dryRun) {
        await ensureParentDirectory(outputPath);
        await ensureParentDirectory(options.cache);
        await ensureParentDirectory(options.report || `${outputPath}.report.json`);
        await fs.promises.writeFile(outputPath, JSON.stringify(translatedData), "utf8");
        await fs.promises.writeFile(options.cache, JSON.stringify(state.cache, null, 2), "utf8");
        await fs.promises.writeFile(options.report || `${outputPath}.report.json`, JSON.stringify(report, null, 2), "utf8");
    }
    console.log(JSON.stringify(report, null, 2));
}
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
