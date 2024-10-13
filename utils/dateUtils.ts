export const fDateLocale=(date:Date, format:string)=>{

    const d=new Date(date)

    return d.toLocaleDateString(format, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    })
    
}

export const fDateToYMD = (date: Date): string => {
    return date.toISOString().split('T')[0];
}


export const fDateFromYMDToDMY = (date: string): string => {
    return date.split('-').reverse().join('.');
}

export const fDateToDMY = (date: Date): string => {
    return fDateFromYMDToDMY(date.toISOString().split('T')[0]);
}

export const fDateToInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };