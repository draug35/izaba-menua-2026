(function () {
  const HERE = "Hemen erosi / eraman";
  const LOCAL = "Han erosi / txandaka";
  const KITCHEN = "Sukaldea";
  const BASE_PEOPLE = 53;

  function ing(name, category, unit, amountMin, amountMax, purchaseType, note, scalable) {
    return {
      name,
      category,
      unit,
      amountMin,
      amountMax: amountMax ?? null,
      scalable: scalable !== false,
      purchaseType: purchaseType || LOCAL,
      note: note || ""
    };
  }

  function loose(name, category, note, purchaseType) {
    return ing(name, category, "", null, null, purchaseType || KITCHEN, note || "behar adina", false);
  }

  function recipe(id, title, mealTypes, ingredients, notes, tags) {
    return {
      id,
      title,
      mealTypes,
      basePeople: BASE_PEOPLE,
      ingredients,
      notes: notes || "",
      tags: tags || []
    };
  }

  const recipes = {
    "gosari-finkoa": recipe(
      "gosari-finkoa",
      "Gosari finkoa",
      ["breakfast"],
      [
        ing("Ogia", "Ogia", "barra", 0, null, LOCAL, "Aurreko eguneko soberakina lehenetsi.", false),
        ing("Esnea", "Gosaria", "L", 14.5, null, LOCAL, "Eguneko kalkulua 130 L / 9 gosari eginda."),
        ing("Olo/soja edaria", "Gosaria", "L", 0.8, 0.9, HERE, "Dieta edo alternatibarako."),
        ing("Kakao disolbagarria", "Gosaria", "kg", 0.5, 0.6, HERE, "Etiketa berrikusi."),
        ing("Maria motako gailetak", "Gosaria", "pakete", 2, null, HERE, "Pakete handiak."),
        ing("Glutenik gabeko gailetak", "Glutenik gabe", "pakete", 1, null, HERE, "Kutxa itxian gorde."),
        ing("Glutenik gabeko ogia", "Glutenik gabe", "pakete", 1, null, HERE, "Ogi arruntetik bereizita."),
        ing("Gurina", "Gosaria", "kg", 0.6, null, LOCAL, "Hotzekoa."),
        ing("Marmelada", "Gosaria", "pote", 2, null, HERE, "Aukera sinpleak.")
      ],
      "3tik 11ra. Glutenik gabekoa aparte eta itxita.",
      ["gosaria", "glutenik gabe"]
    ),
    "etxeko-bazkaria": recipe(
      "etxeko-bazkaria",
      "Parte-hartzaileek etxetik dakarte",
      ["lunch"],
      [],
      "Sukaldeko erosketarik ez. Alergiak badaude, janaria ez trukatzea.",
      ["logistika"]
    ),
    "york-gazta-sandwicha": recipe(
      "york-gazta-sandwicha",
      "York eta gazta sandwicha + fruta + fruitu lehorrak",
      ["snack"],
      [
        ing("Moldeko ogia", "Ogia", "pakete", 7, null, LOCAL, ""),
        ing("York urdaiazpiko naturala", "Hestebeteak", "xerra", 55, null, LOCAL, "Etiketa berrikusi."),
        ing("Gazta xerratan", "Esnekiak", "xerra", 55, null, LOCAL, ""),
        ing("Fruta", "Fruta", "pieza", 53, null, LOCAL, ""),
        ing("Fruitu lehorrak / kakahueteak", "Askariak", "kg", 1.1, 1.3, HERE, "Aparte atera."),
        ing("Glutenik gabeko ogia", "Glutenik gabe", "pakete", 1, null, HERE, ""),
        ing("Glutenik gabeko yorka", "Glutenik gabe", "xerra", 4, 6, LOCAL, "Ziurtatua."),
        ing("Glutenik gabeko gazta", "Glutenik gabe", "xerra", 4, 6, LOCAL, "Ziurtatua.")
      ],
      "Prestatu lehenik fruitu lehorrik gabeko eta glutenik gabeko anoak.",
      ["glutenik gabe", "fruitu lehorrak"]
    ),
    "karbonara-entsalada": recipe(
      "karbonara-entsalada",
      "Entsalada + pasta karbonara + jogurta",
      ["dinner"],
      [
        ing("Letxuga", "Barazkiak", "unitate", 13, null, LOCAL, ""),
        ing("Tomatea", "Barazkiak", "kg", 6, null, LOCAL, ""),
        ing("Tipula", "Barazkiak", "kg", 2, null, LOCAL, ""),
        ing("Olibak", "Kontserbak", "lata", 2, null, HERE, "Lata handiak."),
        ing("Pasta arrunta", "Pasta eta arroza", "kg", 7, null, HERE, ""),
        ing("Glutenik gabeko pasta", "Glutenik gabe", "g", 500, 750, HERE, "Lehenik egosi."),
        ing("Bacon", "Haragia", "kg", 3, 3.5, LOCAL, ""),
        ing("Txanpinoiak", "Barazkiak", "kg", 3, null, LOCAL, ""),
        ing("Saltsarako tipula", "Barazkiak", "kg", 1.5, null, LOCAL, ""),
        ing("Esnegaina edo esne lurrundua", "Saltsak", "L", 5, 6, HERE, "Alternatibak bereizi."),
        ing("Gazta birrindua/hautsean", "Esnekiak", "kg", 1.5, 2, LOCAL, ""),
        ing("Jogurtak", "Postreak", "unitate", 53, null, LOCAL, "Hotzekoa."),
        ing("Ogia", "Ogia", "barra", 15, null, LOCAL, "")
      ],
      "Glutenik gabeko pasta lehenik, lapiko eta iragazki garbiekin.",
      ["glutenik gabe", "esnekiak"]
    ),
    "frankfurt-bokata": recipe(
      "frankfurt-bokata",
      "Frankfurt eta gazta bokata + txokolatea + fruta",
      ["lunch"],
      [
        ing("Ogia", "Ogia", "barra", 25, null, LOCAL, ""),
        ing("Glutenik gabeko ogia", "Glutenik gabe", "pakete", 2, 3, HERE, ""),
        ing("Frankfurt saltxitxak", "Haragia", "unitate", 115, 120, LOCAL, "Zeliakoentzat ziurtatuak."),
        ing("Gazta", "Esnekiak", "kg", 2, null, LOCAL, ""),
        ing("Txokolatea", "Askariak", "tableta", 16, null, HERE, "Arrastoak begiratu."),
        ing("Fruta", "Fruta", "pieza", 53, null, LOCAL, "")
      ],
      "Erabili zeliakoentzat ziurtatutako saltxitxa.",
      ["glutenik gabe"]
    ),
    "indioilar-gazta-sandwicha": recipe(
      "indioilar-gazta-sandwicha",
      "Indioilar eta gazta sandwicha + fruta + fruitu lehorrak",
      ["snack"],
      [
        ing("Moldeko ogia", "Ogia", "pakete", 7, null, LOCAL, ""),
        ing("Indioilar naturala", "Hestebeteak", "xerra", 55, null, LOCAL, "Etiketa berrikusi."),
        ing("Gazta", "Esnekiak", "xerra", 55, null, LOCAL, ""),
        ing("Fruta", "Fruta", "pieza", 53, null, LOCAL, ""),
        ing("Fruitu lehorrak / kakahueteak", "Askariak", "kg", 1.1, 1.3, HERE, "Aparte atera."),
        ing("Glutenik gabeko ogia", "Glutenik gabe", "pakete", 1, null, HERE, ""),
        ing("Glutenik gabeko indioilarra", "Glutenik gabe", "xerra", 4, 6, LOCAL, "Ziurtatua.")
      ],
      "Anoa bereziak itxita utzi fruitu lehorrak atera aurretik.",
      ["glutenik gabe", "fruitu lehorrak"]
    ),
    "kalabazin-krema-oilaskoa": recipe(
      "kalabazin-krema-oilaskoa",
      "Kalabazin-krema + oilaskoa tomatean + natillak",
      ["dinner"],
      [
        ing("Kalabazina", "Barazkiak", "kg", 11, null, LOCAL, ""),
        ing("Kremarako patata", "Barazkiak", "kg", 4, null, LOCAL, ""),
        ing("Tipula", "Barazkiak", "kg", 1.5, null, LOCAL, ""),
        ing("Barazki-salda", "Saldak", "L", 5, null, HERE, "Glutenik gabea ziurtatu."),
        ing("Ura", "Sukaldea", "L", 5, null, KITCHEN, ""),
        ing("Oilasko-bularkia", "Haragia", "kg", 10, 11, LOCAL, ""),
        ing("Tomate frijitua", "Saltsak", "kg", 2.5, 3, HERE, "Etiketa berrikusi."),
        ing("Patata frijituak", "Oinarrizkoak", "poltsa", 10, null, LOCAL, "Poltsa handiak."),
        ing("Natillak", "Postreak", "unitate", 53, null, LOCAL, "Glutenik gabea berrikusi."),
        ing("Ogia", "Ogia", "barra", 15, null, LOCAL, "")
      ],
      "Salda eta tomatea berrikusi glutenik gabekoentzat.",
      ["glutenik gabe"]
    ),
    "dilistak-txorizoa": recipe(
      "dilistak-txorizoa",
      "Dilistak barazkiekin eta txorizoarekin + fruta",
      ["lunch"],
      [
        ing("Dilistak egosita", "Lekaleak", "kg", 17, 18, HERE, ""),
        ing("Piper berdea", "Barazkiak", "kg", 1.2, null, LOCAL, ""),
        ing("Azenarioa", "Barazkiak", "kg", 1.5, 2, LOCAL, ""),
        ing("Tomate/tipula/porru sofritoa", "Saltsak", "kg", 2, null, HERE, ""),
        ing("Baratxuria", "Barazkiak", "buru", 2, null, LOCAL, ""),
        ing("Txorizoa", "Hestebeteak", "zati", 75, 80, LOCAL, "Aparte egin."),
        ing("Barazki-salda", "Saldak", "L", 2, null, HERE, "Etiketa berrikusi."),
        ing("Ardo zuria", "Oinarrizkoak", "botila", 1, null, HERE, ""),
        ing("Fruta", "Fruta", "pieza", 53, null, LOCAL, ""),
        ing("Ogia", "Ogia", "barra", 15, null, LOCAL, "")
      ],
      "Hobe txorizoa aparte: beganoa eta glutenik gabekoa errazten ditu.",
      ["beganoa erraz", "glutenik gabe"]
    ),
    "txokolate-sandwicha": recipe(
      "txokolate-sandwicha",
      "Txokolate sandwicha + fruta + fruitu lehorrak",
      ["snack"],
      [
        ing("Moldeko ogia", "Ogia", "pakete", 7, null, LOCAL, ""),
        ing("Txokolatea", "Askariak", "tableta", 16, null, HERE, "Arrastoak begiratu."),
        ing("Fruta", "Fruta", "pieza", 53, null, LOCAL, ""),
        ing("Fruitu lehorrak / kakahueteak", "Askariak", "kg", 1.1, 1.3, HERE, "Aparte atera."),
        ing("Glutenik gabeko ogia", "Glutenik gabe", "pakete", 1, null, HERE, ""),
        ing("Glutenik gabeko txokolatea", "Glutenik gabe", "tableta", 2, null, HERE, "")
      ],
      "Txokolatearen fruitu lehor eta gluten arrastoak begiratu.",
      ["glutenik gabe", "fruitu lehorrak"]
    ),
    "albondigak-patata": recipe(
      "albondigak-patata",
      "Entsalada + albondigak saltsan patatekin + jogurta",
      ["dinner"],
      [
        ing("Letxuga", "Barazkiak", "unitate", 11, null, LOCAL, ""),
        ing("Tomatea", "Barazkiak", "kg", 6, null, LOCAL, ""),
        ing("Entsaladarako tipula", "Barazkiak", "kg", 3, null, LOCAL, ""),
        ing("Atuna", "Kontserbak", "lata", 8, null, HERE, "Lata ertainak."),
        ing("Albondigak", "Haragia", "unitate", 260, null, LOCAL, "Glutenik gabea egiaztatu."),
        ing("Patata naturala", "Barazkiak", "kg", 6, 6.5, LOCAL, ""),
        ing("Tomate/tipula/porru sofritoa", "Saltsak", "kg", 2, null, HERE, ""),
        ing("Barazki-salda", "Saldak", "L", 2, null, HERE, "Etiketa berrikusi."),
        ing("Ardo zuria", "Oinarrizkoak", "botila", 1, null, HERE, ""),
        ing("Maizena", "Oinarrizkoak", "pakete", 1, null, HERE, ""),
        ing("Azenarioa", "Barazkiak", "kg", 1.5, null, LOCAL, ""),
        ing("Jogurtak", "Postreak", "unitate", 53, null, LOCAL, ""),
        ing("Ogia", "Ogia", "barra", 15, null, LOCAL, "")
      ],
      "Zeliakoentzat albondigak egiaztatu edo proteina aparte egin.",
      ["glutenik gabe"]
    ),
    "garbantzu-espeziatuak": recipe(
      "garbantzu-espeziatuak",
      "Garbantzu espeziatuak barazkiekin + arroza + fruta",
      ["lunch"],
      [
        ing("Garbantzuak egosita", "Lekaleak", "kg", 17, 18, HERE, "Beganoentzat erabilgarria."),
        ing("Arroza", "Pasta eta arroza", "kg", 3.5, null, HERE, ""),
        ing("Tipula", "Barazkiak", "kg", 2, null, LOCAL, ""),
        ing("Azenarioa", "Barazkiak", "kg", 1.5, 2, LOCAL, ""),
        ing("Baratxuria", "Barazkiak", "buru", 2, null, LOCAL, ""),
        ing("Tomate kontzentratua", "Saltsak", "g", 500, null, HERE, ""),
        ing("Koko-esnea", "Saltsak", "L", 4, null, HERE, ""),
        loose("Curry/kuminoa/kurkuma", "Oinarrizkoak", "behar adina", HERE),
        ing("Fruta", "Fruta", "pieza", 53, null, LOCAL, ""),
        ing("Ogia", "Ogia", "barra", 15, null, LOCAL, "")
      ],
      "Oinarrizko plater oso egokia denentzat.",
      ["beganoa", "glutenik gabe"]
    ),
    "jamon-lomo-gazta-sandwicha": recipe(
      "jamon-lomo-gazta-sandwicha",
      "Urdaiazpiko/solomo eta gazta sandwicha + fruta + fruitu lehorrak",
      ["snack"],
      [
        ing("Moldeko ogia", "Ogia", "pakete", 7, null, LOCAL, ""),
        ing("Urdaiazpiko ondua/solomo naturala", "Hestebeteak", "xerra", 55, 60, LOCAL, "Etiketa berrikusi."),
        ing("Gazta", "Esnekiak", "xerra", 55, null, LOCAL, ""),
        ing("Fruta", "Fruta", "pieza", 53, null, LOCAL, ""),
        ing("Fruitu lehorrak / kakahueteak", "Askariak", "kg", 1.1, 1.3, HERE, ""),
        ing("Glutenik gabeko ogia", "Glutenik gabe", "pakete", 1, null, HERE, ""),
        ing("Glutenik gabeko hestebetea", "Glutenik gabe", "xerra", 4, 6, LOCAL, "")
      ],
      "Glutenik gabekoa labana garbiarekin prestatu.",
      ["glutenik gabe", "fruitu lehorrak"]
    ),
    "pasta-entsalada-solomoa": recipe(
      "pasta-entsalada-solomoa",
      "Pasta-entsalada + solomoa piper-saltsan + jogurta",
      ["dinner"],
      [
        ing("Pasta arrunta", "Pasta eta arroza", "kg", 4, 4.5, HERE, ""),
        ing("Glutenik gabeko pasta", "Glutenik gabe", "g", 500, null, HERE, ""),
        ing("Atuna", "Kontserbak", "lata", 8, null, HERE, "Lata ertainak."),
        ing("Tomatea", "Barazkiak", "kg", 2.5, 3, LOCAL, ""),
        ing("Artoa", "Kontserbak", "kg", 2.5, null, HERE, ""),
        ing("Tipula morea", "Barazkiak", "kg", 0.8, 1, LOCAL, ""),
        ing("Olibak", "Kontserbak", "lata", 2, null, HERE, "Lata handiak."),
        ing("Solomoa", "Haragia", "xerra", 150, 160, LOCAL, ""),
        ing("Piperrak latan", "Kontserbak", "kg", 2, null, HERE, ""),
        ing("Sofritoa", "Saltsak", "kg", 2, null, HERE, ""),
        ing("Jogurtak", "Postreak", "unitate", 53, null, LOCAL, ""),
        ing("Ogia", "Ogia", "barra", 15, null, LOCAL, "")
      ],
      "Glutenik gabeko pasta bereizi nahasi aurretik.",
      ["glutenik gabe"]
    ),
    "babarrun-zuriak-txorizoa": recipe(
      "babarrun-zuriak-txorizoa",
      "Babarrun zuriak barazkiekin eta txorizoarekin + fruta",
      ["lunch"],
      [
        ing("Babarrun zuriak egosita", "Lekaleak", "kg", 17, 18, HERE, ""),
        ing("Piper berdea", "Barazkiak", "kg", 1.2, null, LOCAL, ""),
        ing("Tomate/tipula/porru sofritoa", "Saltsak", "kg", 2, null, HERE, ""),
        ing("Azenarioa", "Barazkiak", "kg", 1.5, null, LOCAL, ""),
        ing("Kalabazina", "Barazkiak", "kg", 1.5, 2, LOCAL, ""),
        ing("Patata", "Barazkiak", "kg", 4, null, LOCAL, ""),
        ing("Txorizoa", "Hestebeteak", "zati", 75, 80, LOCAL, "Aparte egin."),
        ing("Ardo zuria", "Oinarrizkoak", "botila", 1, null, HERE, ""),
        ing("Fruta", "Fruta", "pieza", 53, null, LOCAL, ""),
        ing("Ogia", "Ogia", "barra", 15, null, LOCAL, "")
      ],
      "Txorizoa aparte.",
      ["beganoa erraz", "glutenik gabe"]
    ),
    "oilaskoa-gazta-saltsan": recipe(
      "oilaskoa-gazta-saltsan",
      "Entsalada + oilaskoa gazta-saltsan + natillak",
      ["dinner"],
      [
        ing("Letxuga", "Barazkiak", "unitate", 13, null, LOCAL, ""),
        ing("Tomatea", "Barazkiak", "kg", 6, null, LOCAL, ""),
        ing("Tipula", "Barazkiak", "kg", 3, null, LOCAL, ""),
        ing("Oilasko-bularkia", "Haragia", "kg", 10, 11, LOCAL, ""),
        ing("Gazta urtua", "Esnekiak", "kg", 2, null, LOCAL, ""),
        ing("Gazta urdina", "Esnekiak", "g", 300, 400, LOCAL, ""),
        ing("Koko-esnea/esnegaina", "Saltsak", "L", 3.5, 4, HERE, "Dieten arabera bereizi."),
        ing("Patata frijituak", "Oinarrizkoak", "poltsa", 10, null, LOCAL, "Poltsa handiak."),
        ing("Natillak", "Postreak", "unitate", 53, null, LOCAL, ""),
        ing("Ogia", "Ogia", "barra", 15, null, LOCAL, "")
      ],
      "Gazta-saltsa aparte, dieta berezirik badago.",
      ["esnekiak", "dieta bereziak"]
    ),
    "solomo-gazta-bokata": recipe(
      "solomo-gazta-bokata",
      "Solomo eta gazta bokata + txokolatea + fruta",
      ["lunch"],
      [
        ing("Ogia", "Ogia", "barra", 25, null, LOCAL, ""),
        ing("Glutenik gabeko ogia", "Glutenik gabe", "pakete", 2, 3, HERE, ""),
        ing("Solomo naturala", "Haragia", "xerra", 105, 110, LOCAL, ""),
        ing("Gazta", "Esnekiak", "kg", 2.2, null, LOCAL, "Aparte esnekirik hartzen ez duenarentzat."),
        ing("Txokolatea", "Askariak", "tableta", 16, null, HERE, "Arrastoak begiratu."),
        ing("Fruta", "Fruta", "pieza", 53, null, LOCAL, "")
      ],
      "Gazta aparte behar duenarentzat.",
      ["glutenik gabe", "esnekiak"]
    ),
    "barazki-krema-saltxitxak": recipe(
      "barazki-krema-saltxitxak",
      "Barazki-krema + saltxitxak patata-purearekin + jogurta",
      ["dinner"],
      [
        ing("Kalabazina", "Barazkiak", "kg", 6.5, 7, LOCAL, ""),
        ing("Azenarioa", "Barazkiak", "kg", 1.5, 2, LOCAL, ""),
        ing("Sofritoa", "Saltsak", "kg", 2, null, HERE, ""),
        ing("Barazki-salda", "Saldak", "L", 6, null, HERE, "Etiketa berrikusi."),
        ing("Kremarako patata", "Barazkiak", "kg", 3.5, 4, LOCAL, ""),
        ing("Saltxitxak", "Haragia", "unitate", 200, 210, LOCAL, "Glutenik gabea berrikusi."),
        ing("Patata-purea", "Pasta eta arroza", "kg", 1.5, 1.8, HERE, "Glutenik gabea berrikusi."),
        ing("Esnea", "Gosaria", "L", 1.5, 2, LOCAL, ""),
        ing("Purearako ura", "Sukaldea", "L", 4, 5, KITCHEN, ""),
        ing("Gurina", "Gosaria", "g", 750, 1000, LOCAL, ""),
        ing("Jogurtak", "Postreak", "unitate", 53, null, LOCAL, ""),
        ing("Ogia", "Ogia", "barra", 15, null, LOCAL, "")
      ],
      "Purea eta saltxitxak zeliakoentzat berrikusi.",
      ["glutenik gabe"]
    ),
    "garbantzuak-txorizoa": recipe(
      "garbantzuak-txorizoa",
      "Garbantzuak barazkiekin eta txorizoarekin + fruta",
      ["lunch"],
      [
        ing("Garbantzuak egosita", "Lekaleak", "kg", 17, 18, HERE, ""),
        ing("Piper berdea", "Barazkiak", "kg", 1.2, null, LOCAL, ""),
        ing("Tomate/tipula/porru sofritoa", "Saltsak", "kg", 2, null, HERE, ""),
        ing("Azenarioa", "Barazkiak", "kg", 1.5, null, LOCAL, ""),
        ing("Kalabazina", "Barazkiak", "kg", 1.5, 2, LOCAL, ""),
        ing("Patata", "Barazkiak", "kg", 4, null, LOCAL, ""),
        ing("Txorizoa", "Hestebeteak", "zati", 75, 80, LOCAL, "Aparte egin."),
        ing("Ardo zuria", "Oinarrizkoak", "botila", 1, null, HERE, ""),
        ing("Fruta", "Fruta", "pieza", 53, null, LOCAL, ""),
        ing("Ogia", "Ogia", "barra", 15, null, LOCAL, "")
      ],
      "Txorizoa aparte.",
      ["beganoa erraz", "glutenik gabe"]
    ),
    "gazta-krema-sandwicha": recipe(
      "gazta-krema-sandwicha",
      "Gazta krema sandwicha + fruta + fruitu lehorrak",
      ["snack"],
      [
        ing("Moldeko ogia", "Ogia", "pakete", 7, null, LOCAL, ""),
        ing("Gazta krema", "Esnekiak", "ontzi", 6, 7, LOCAL, "250 g-ko ontziak."),
        ing("Fruta", "Fruta", "pieza", 53, null, LOCAL, ""),
        ing("Fruitu lehorrak / kakahueteak", "Askariak", "kg", 1.1, 1.3, HERE, ""),
        ing("Glutenik gabeko ogia", "Glutenik gabe", "pakete", 1, null, HERE, ""),
        ing("Glutenik gabeko gazta krema", "Glutenik gabe", "ontzi", 1, null, LOCAL, "")
      ],
      "Ez erabili ogi-apurrak dituen labana arrunta.",
      ["glutenik gabe", "fruitu lehorrak", "esnekiak"]
    ),
    "oilasko-curry-arroza": recipe(
      "oilasko-curry-arroza",
      "Oilaskoa curryan arrozarekin + jogurta",
      ["dinner"],
      [
        ing("Arroza", "Pasta eta arroza", "kg", 3.5, null, HERE, ""),
        ing("Oilasko-bularkia zatituta", "Haragia", "kg", 10, 11, LOCAL, ""),
        ing("Koko-esnea", "Saltsak", "L", 5.5, 6, HERE, ""),
        ing("Tomate/tipula/porru sofritoa", "Saltsak", "kg", 2, null, HERE, ""),
        ing("Piper gorria latan", "Kontserbak", "pote", 1, null, HERE, "Pote handia."),
        loose("Curry leuna", "Oinarrizkoak", "behar adina", HERE),
        loose("Kurkuma/kuminoa/jengibrea", "Oinarrizkoak", "behar adina", HERE),
        ing("Jogurtak", "Postreak", "unitate", 53, null, LOCAL, ""),
        ing("Ogia", "Ogia", "barra", 12, 15, LOCAL, "")
      ],
      "Curry leuna, heroikeriarik gabe.",
      ["glutenik gabe"]
    ),
    "ilarrak-oilaskoa": recipe(
      "ilarrak-oilaskoa",
      "Ilarrak patatarekin + oilaskoa plantxan + jogurta",
      ["lunch"],
      [
        ing("Ilarrak", "Barazkiak", "kg", 5, null, LOCAL, ""),
        ing("Gisaturako patata", "Barazkiak", "kg", 5, null, LOCAL, ""),
        ing("Tipula", "Barazkiak", "kg", 1.5, 2, LOCAL, ""),
        ing("Baratxuria", "Barazkiak", "buru", 1, null, LOCAL, ""),
        ing("Barazki-salda", "Saldak", "L", 3, 4, HERE, "Etiketa berrikusi."),
        ing("Oilasko-bularkia", "Haragia", "kg", 8, 9, LOCAL, ""),
        ing("Patata frijituak", "Oinarrizkoak", "poltsa", 10, null, LOCAL, "Poltsa handiak."),
        ing("Jogurtak", "Postreak", "unitate", 53, null, LOCAL, ""),
        ing("Ogia", "Ogia", "barra", 15, null, LOCAL, "")
      ],
      "Proteina beganoa gehitu behar bada.",
      ["beganoa egokitu"]
    ),
    "iruneko-txorizo-askaria": recipe(
      "iruneko-txorizo-askaria",
      "Iruñeko txorizo bokata/sandwicha + fruta + fruitu lehorrak",
      ["snack"],
      [
        ing("Moldeko ogia edo ogia", "Ogia", "pakete", 7, null, LOCAL, "Edo 15 barra."),
        ing("Iruñeko txorizoa", "Hestebeteak", "xerra", 260, null, LOCAL, "Zeliakoentzat ziurtatua."),
        ing("Fruta", "Fruta", "pieza", 53, null, LOCAL, ""),
        ing("Fruitu lehorrak / kakahueteak", "Askariak", "kg", 1.1, 1.3, HERE, ""),
        ing("Glutenik gabeko ogia", "Glutenik gabe", "pakete", 1, null, HERE, ""),
        ing("Glutenik gabeko alternatiba", "Glutenik gabe", "anoa", 4, 6, LOCAL, "")
      ],
      "Hestebete ziurtatua zeliakoentzat.",
      ["glutenik gabe", "fruitu lehorrak"]
    ),
    "pasta-boloniarra": recipe(
      "pasta-boloniarra",
      "Pasta boloniarra + natillak",
      ["dinner"],
      [
        ing("Pasta arrunta", "Pasta eta arroza", "kg", 7, null, HERE, ""),
        ing("Glutenik gabeko pasta", "Glutenik gabe", "g", 500, 750, HERE, "Lehenik egosi."),
        ing("Haragi xehatua", "Haragia", "kg", 5.5, 6, LOCAL, ""),
        ing("Txanpinoiak", "Barazkiak", "kg", 3, null, LOCAL, ""),
        ing("Tomate/tipula/porru sofritoa", "Saltsak", "kg", 2, null, HERE, ""),
        ing("Piper berdea", "Barazkiak", "kg", 1.2, null, LOCAL, ""),
        ing("Tomate frijitua/birrindua", "Saltsak", "kg", 4, 5, HERE, "Etiketa berrikusi."),
        ing("Gazta birrindua", "Esnekiak", "kg", 2.5, null, LOCAL, "Aparte zerbitzatu."),
        ing("Natillak", "Postreak", "unitate", 53, null, LOCAL, ""),
        ing("Ogia", "Ogia", "barra", 15, null, LOCAL, "")
      ],
      "Tomatezko oinarrizko saltsa; gazta aparte.",
      ["glutenik gabe", "esnekiak"]
    ),
    "indioilar-gazta-bokata": recipe(
      "indioilar-gazta-bokata",
      "Indioilar eta gazta bokata + txokolatea + fruta",
      ["lunch"],
      [
        ing("Ogia", "Ogia", "barra", 25, null, LOCAL, ""),
        ing("Glutenik gabeko ogia", "Glutenik gabe", "pakete", 2, 3, HERE, ""),
        ing("Indioilar naturala", "Hestebeteak", "xerra", 55, 60, LOCAL, "Etiketa berrikusi."),
        ing("Gazta", "Esnekiak", "kg", 2.2, null, LOCAL, ""),
        ing("Txokolatea", "Askariak", "tableta", 16, null, HERE, "Arrastoak begiratu."),
        ing("Fruta", "Fruta", "pieza", 53, null, LOCAL, "")
      ],
      "Azken eguna: ez konplikatu.",
      ["glutenik gabe"]
    ),
    "azken-askaria": recipe(
      "azken-askaria",
      "Aukerako askaria: fruta + fruitu lehorrak + gailetak",
      ["snack"],
      [
        ing("Fruta", "Fruta", "pieza", 53, null, LOCAL, ""),
        ing("Fruitu lehorrak / kakahueteak", "Askariak", "kg", 1.1, null, HERE, ""),
        ing("Gailetak", "Askariak", "pakete", 4, 5, HERE, "")
      ],
      "Irteera berandu bada bakarrik.",
      ["aukerakoa", "fruitu lehorrak"]
    )
  };

  // Dieta berezietako anoak (glutenik gabe) finkoak dira: zeliako kopuru txikiarentzat dira,
  // eta EZ dira lagun kopuru osoarekin eskalatu behar.
  Object.values(recipes).forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      if (ingredient.category === "Glutenik gabe" || /glutenik gabe/i.test(ingredient.name)) {
        ingredient.scalable = false;
      }
    });
  });

  const initialSlots = [
    { breakfast: null, lunch: "etxeko-bazkaria", snack: "york-gazta-sandwicha", dinner: "karbonara-entsalada" },
    { breakfast: "gosari-finkoa", lunch: "frankfurt-bokata", snack: "indioilar-gazta-sandwicha", dinner: "kalabazin-krema-oilaskoa" },
    { breakfast: "gosari-finkoa", lunch: "dilistak-txorizoa", snack: "txokolate-sandwicha", dinner: "albondigak-patata" },
    { breakfast: "gosari-finkoa", lunch: "garbantzu-espeziatuak", snack: "jamon-lomo-gazta-sandwicha", dinner: "pasta-entsalada-solomoa" },
    { breakfast: "gosari-finkoa", lunch: "babarrun-zuriak-txorizoa", snack: "txokolate-sandwicha", dinner: "oilaskoa-gazta-saltsan" },
    { breakfast: "gosari-finkoa", lunch: "solomo-gazta-bokata", snack: "indioilar-gazta-sandwicha", dinner: "barazki-krema-saltxitxak" },
    { breakfast: "gosari-finkoa", lunch: "garbantzuak-txorizoa", snack: "gazta-krema-sandwicha", dinner: "oilasko-curry-arroza" },
    { breakfast: "gosari-finkoa", lunch: "solomo-gazta-bokata", snack: "indioilar-gazta-sandwicha", dinner: "albondigak-patata" },
    { breakfast: "gosari-finkoa", lunch: "ilarrak-oilaskoa", snack: "iruneko-txorizo-askaria", dinner: "pasta-boloniarra" },
    { breakfast: "gosari-finkoa", lunch: "indioilar-gazta-bokata", snack: "azken-askaria", dinner: null }
  ];

  function isoDate(offset) {
    const date = new Date(Date.UTC(2026, 6, 2 + offset));
    return date.toISOString().slice(0, 10);
  }

  const days = initialSlots.map((slots, index) => ({
    id: isoDate(index),
    date: isoDate(index),
    label: `${index + 2}. eguna`,
    slots: { ...slots }
  }));

  window.IZABA_DEFAULT_DATA = {
    version: 1,
    people: BASE_PEOPLE,
    dateRange: {
      start: days[0].date,
      end: days[days.length - 1].date
    },
    services: [
      { key: "breakfast", label: "Gosaria" },
      { key: "lunch", label: "Bazkaria" },
      { key: "snack", label: "Askaria" },
      { key: "dinner", label: "Afaria" }
    ],
    recipes,
    days
  };
}());
