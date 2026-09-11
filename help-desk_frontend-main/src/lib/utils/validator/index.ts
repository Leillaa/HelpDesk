

class Validator {

    hasForbiddenLetters (str : string) {
        // 37 45 95 65-90 97-122 49-57 64(@) 46(.) - разрешенные коды букв
        let flag = false
        let ch = 0
        for( let i of str ) {
            ch = i.charCodeAt(0);
            if (i != '-' && i != '_' && i != '%' && i != '@' && i != '.' && !(ch >= 65 && ch <= 90) && !(ch >= 97 && ch <= 122) && !(ch >= 48 && ch <= 57) ) {
                
                flag = true
                break;
            }
        }
        return flag;
    }
    

}

export default Validator