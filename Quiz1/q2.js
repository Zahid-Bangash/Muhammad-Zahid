let palindrome=(str)=>{
    const array=str.split('');
    const reverse=array.reverse();
    const revStr=reverse.join('');
    if(str===revStr){
        console.log('Given String is a palindrome');
    }
    else{
        console.log('Given String is not a palindrome')
    }
}

palindrome('abaababac');