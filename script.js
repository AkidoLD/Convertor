// Creation du code de ma pag en respectant le MVC

//==================Model==================//

//Fonction qui permet de recuperer la valeur numerique d'un caractere
function to_integer(c) {
    if(c == null)
        throw new Error("Le parametre passe est null"); 
    if (typeof c !== 'string' || c.length !== 1) 
        throw new Error("Le parametre doit etre un seul caractere.");

    c = c.toUpperCase(); // On normalise en majuscule
    if (c >= '0' && c <= '9') {
        return parseInt(c);
    }
    //
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) {
        return code - 55;
    }
    //
    throw new Error(`Le caractere '${c}' n'est pas pris en charge.`);
}

//Fonction qui a partir d'un entier retourne le caractere correspondant pour la convertion de base
function to_string(n){
    if(n == null || typeof n !== 'number' || n > 35)
        throw new Error("Le parametre doit etre un nombre et n < 36"); 
    //
    
    if(n < 10)
        return n.toString(); 
    //
    return String.fromCharCode(n + 55); 
    //
}

//J'ai enfin decrypte de processus de la division ce qui me permet de faire des trucs comme ca.(PS : C'est un peu exagere dire que j'ai compris la division mais j'ai reussi a l'isole 
// en division de simple chiffre)

//Je vous presente mon nouveau mode de division 🙂

/**
 * Cette fonction en parametre le dividante et le diviseur. Quelque soit la base je pense que tant que la regle est respecte pas besoin de base. 
*/
function t_div(dividande, divide){
    //Verification avant de commencer reellement
    if(dividande == null || divide == null)
        throw new Error("Une des arguments passe en parametre est null"); 

    if(isNaN(dividande))
        throw new TypeError("Le dividande doit etre un nombre."); 
    if(isNaN(divide))
        throw new TypeError("Le diviseur doit etre un nombre");
    if(divide === 0)
        throw new Error("Division par 0 interdite"); 

    //Division unitaire
    
    let result = { //Variable de stockage du resultat
        e: 0, 
        r: 0
    }

    for(let c of dividande.toString()){
        let _dividande = (result.r * 10) + to_integer(c); 
        result.e = (result.e * 10) +  parseInt(_dividande/divide); 
        result.r = _dividande % divide; 
    }
    
    //
    return result; 
}

//Fonction qui permet de convertir de la base 10 vers n'imp base
function deci_to_other(number, base){
    if(number == null || base  == null)
        throw new Error("Un des parametre passe est null");
    if(isNaN(number) || isNaN(base))
        throw new TypeError("La valeur passe en parametre doit etre un nombre"); 
    if(base < 2 || base > 35)
        throw new RangeError("La base doit etre comprise entre 2 et 35");
    
    //Commencer la convertion
    let convert_number = []; 

    while(number > 0){
        let _n = t_div(number, base); 
        convert_number.push(to_string(_n.r)); 
        number = _n.e ;
    }
    //
    return convert_number.reverse().join('');
}
// alert(deci_to_other(1957, 2));

//Fonction d'un nombre de n'importe quelle base vers la base 10
function other_to_deci(number , base){
    if(number ==  null || base == null)
        throw new Error("L'un des parametre est null"); 
    if(typeof number !== 'string')
        throw new TypeError("La valeur a convertir doit etre sous forme de string."); 
    if(isNaN(base))
        throw new TypeError("La base doit etre de type nombre");
    if(base < 2 || base > 35)
        throw new RangeError("La base doit etre compris entre 2 et 35"); 
    
    //Commencer la convertion
    let convert_number = 0 ; 

    //Renverser la chaine pour faire correspondre les indices
    number = number.split('').reverse().join(''); 

    for(let i = 0 ; i < number.length ; i ++){
        if(to_integer(number[i]) >= base)
            throw new RangeError("Le nombre passe en parametre n'appartient pas a la base " + base); 
        convert_number += to_integer(number[i]) * Math.pow(base, i);
    }
    //
    return convert_number; 
}

//Fonction de convertion multi base
function convert_to(number, in_base = 10, out_base = 2){
    if(number == null || in_base == null || out_base == null)
        throw new Error("L'une des arguments de la fonction est null"); 
    if(typeof number !== 'string')
        throw new TypeError("Le nombre passe en parametre doit etre de type string"); 
    if(isNaN(in_base) || isNaN(out_base))
        throw new TypeError("Les base doivent etre de type entier"); 
    
    //
    return deci_to_other(other_to_deci(number, in_base),out_base);  
}

// alert(deci_to_other(1957, 16)); 
// alert(other_to_deci("7A5", 16)); 
// alert(convert_to("12",8,16));
// alert(convert_to("25"))

//==================Controller==================//

//Recuperation des composants HTML
const in_base_select = document.getElementById("base-depard"); 
const out_base_select = document.getElementById("base-arrive"); 
const in_base_input = document.getElementById("left-convert"); 
const out_base_input = document.getElementById("right-convert"); 
//
const tmp_div = document.getElementById("historique-container");

//Variable qui va stocker le nom des base avec leur correspondance en decimal pour faciliter les choses

const base =  {
    Decimal : 10, 
    Binaire : 2, 
    Octal : 8, 
    Hexadecimal : 16 
}

document.addEventListener('load', main()); 

//Fonction main 🥲
function main(){
    load_base_list(in_base_select, in_base_input); 
    load_base_list(out_base_select,out_base_input); 
    attach_placeholder_listeners(); 
    attach_conversion_listeners(); // <<<<< ici
}

//Fonction qui permet de charger le contenu des base_select
function load_base_list(selector, input){
    if(selector == null)
        throw new Error("L'un des elements passe en parametre est null"); 
    if(!(selector instanceof HTMLSelectElement))
        throw new TypeError("L'element que vous avez passe en parametre n'est pas un <select>"); 

    //Ajouter les element
    selector.innerHTML = ''; 
    for(let b in base){
        selector.innerHTML += `
            <option value = ${base[b]} >${b}</option>
        `;
    }

}

function attach_placeholder_listeners() {
    in_base_select.addEventListener('change', () => {
        update_placeholder(in_base_input, in_base_select.value);
    });

    out_base_select.addEventListener('change', () => {
        update_placeholder(out_base_input, out_base_select.value);
    });
}

function update_placeholder(input, base_value) {
    if (!input) return;
    input.placeholder = `Base ${base_value}`;
}

function attach_conversion_listeners() {
    in_base_input.addEventListener('input', () => {
        if (in_base_input.value === '') {
            out_base_input.value = '';
            return;
        }

        try {
            const converted = convert_to(
                in_base_input.value,
                parseInt(in_base_select.value),
                parseInt(out_base_select.value)
            );
            out_base_input.value = converted;
        } catch (error) {
            out_base_input.value = 'Erreur';
        }
    });

    out_base_input.addEventListener('input', () => {
        if (out_base_input.value === '') {
            in_base_input.value = '';
            return;
        }

        try {
            const converted = convert_to(
                out_base_input.value,
                parseInt(out_base_select.value),
                parseInt(in_base_select.value)
            );
            in_base_input.value = converted;
        } catch (error) {
            in_base_input.value = 'Erreur';
        }
    });
}

