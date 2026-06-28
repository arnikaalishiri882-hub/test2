// آزمایشگاه مجموعه‌های ریاضی - script.js - V.4.41

// ... (بقیه کد مثل قبل) ...

// تابع تشخیص نوع مجموعه (متناهی، نامتناهی، با اعضای زیاد)
function detectSetType(elements, expression) {
    const l = expression.toLowerCase();
    const count = elements.length;
    
    // بررسی وجود کران بالا و پایین
    const hasLowerBound = /[<>≤≥]=?|بین|تا|از/.test(l);
    const hasUpperBound = /[<>≤≥]=?|بین|تا|تا/.test(l);
    const hasBothBounds = /(\d+)\s*[<>≤≥]=?x[<>≤≥]=?\s*(\d+)/.test(l) || 
                          /(\d+)\s*[<>≤≥]=?x/.test(l) && /x[<>≤≥]=?\s*(\d+)/.test(l);
    
    // اگر هر دو کران داشته باشد → متناهی
    if (hasBothBounds || (l.includes('بین') && l.includes('تا'))) {
        if (count > 20) {
            return { type: 'large_finite', message: '⚠️ تعداد اعضای مجموعه زیاد است، همه را نمی‌توان نوشت' };
        }
        return { type: 'finite', message: '' };
    }
    
    // اگر فقط کران پایین داشته باشد → نامتناهی (سمت راست)
    if ((l.includes('بزرگتر') || l.includes('بیشتر') || l.includes('>')) && !l.includes('تا')) {
        return { type: 'infinite_right', message: '⚠️ مجموعه نامتناهی است' };
    }
    
    // اگر فقط کران بالا داشته باشد → نامتناهی (سمت چپ)
    if ((l.includes('کوچکتر') || l.includes('کمتر') || l.includes('<')) && !l.includes('تا')) {
        return { type: 'infinite_left', message: '⚠️ مجموعه نامتناهی است' };
    }
    
    // مجموعه‌های جهانی بدون کران → دو طرف نامتناهی
    if (l.includes('ℤ') || l.includes('صحیح') || l.includes('ℕ') || l.includes('طبیعی') || 
        l.includes('ℝ') || l.includes('حقیقی') || l.includes('ℚ') || l.includes('گویا')) {
        if (!l.includes('بین') && !l.includes('تا') && !l.includes('بزرگتر') && !l.includes('کوچکتر')) {
            return { type: 'infinite_both', message: '⚠️ مجموعه نامتناهی است' };
        }
    }
    
    // اگر تعداد اعضا زیاد باشد
    if (count > 20) {
        return { type: 'large_finite', message: '⚠️ تعداد اعضای مجموعه زیاد است، همه را نمی‌توان نوشت' };
    }
    
    return { type: 'finite', message: '' };
}

// تابع نمایش مجموعه با توجه به نوع آن
function formatSetWithType(elements, expression) {
    if (!elements || elements.length === 0) return '∅';
    
    const sorted = [...elements].sort((a,b) => a - b);
    const setType = detectSetType(elements, expression);
    const maxDisplay = 10;
    let display = sorted.slice(0, maxDisplay);
    
    if (setType.type === 'infinite_left') {
        return `{ ..., ${display.join(', ')} }`;
    } else if (setType.type === 'infinite_right') {
        return `{ ${display.join(', ')}, ... }`;
    } else if (setType.type === 'infinite_both') {
        return `{ ..., ${display.join(', ')}, ... }`;
    } else if (setType.type === 'large_finite') {
        if (sorted.length > maxDisplay) {
            return `{ ${display.join(', ')}, ... (${sorted.length} عضو) }`;
        }
        return `{ ${sorted.join(', ')} }`;
    } else {
        // finite
        if (sorted.length > maxDisplay) {
            return `{ ${display.join(', ')}, ... (${sorted.length} عضو) }`;
        }
        return `{ ${sorted.join(', ')} }`;
    }
}

// تابع دریافت پیام وضعیت مجموعه
function getSetStatusMessage(elements, expression) {
    const setType = detectSetType(elements, expression);
    return setType.message;
}

// تابع تشخیص نوع نامتناهی برای نمایش سه نقطه
function getInfinityTypeForDisplay(elements, expression) {
    const setType = detectSetType(elements, expression);
    if (setType.type === 'infinite_left') return 'left';
    if (setType.type === 'infinite_right') return 'right';
    if (setType.type === 'infinite_both') return 'both';
    return 'none';
}

// به روز رسانی تابع formatInfiniteSet برای استفاده از تشخیص جدید
function formatInfiniteSet(elements, infinityType = 'none') {
    if(!elements || elements.length === 0) return '{ ... }';
    
    const sorted = [...elements].sort((a,b) => a - b);
    const maxDisplay = 10;
    let display = sorted.slice(0, maxDisplay);
    
    if(infinityType === 'left') {
        return `{ ..., ${display.join(', ')} }`;
    } else if(infinityType === 'right') {
        return `{ ${display.join(', ')}, ... }`;
    } else if(infinityType === 'both') {
        return `{ ..., ${display.join(', ')}, ... }`;
    } else {
        if(sorted.length > maxDisplay) {
            return `{ ${display.join(', ')}, ... (${sorted.length} عضو) }`;
        }
        return `{ ${sorted.join(', ')} }`;
    }
}

// به روز رسانی تابع showLivePreview برای نمایش صحیح
function showLivePreview() { 
    const e = document.getElementById('symbolicExpression').value.trim();
    const pc = document.getElementById('previewContainer');
    const lp = document.getElementById('livePreview'); 
    if(!e){pc.style.display='none';return;} 
    try{
        const el = parseSymbolicExpression(e);
        const infType = getInfinityTypeForDisplay(el, e);
        const statusMsg = getSetStatusMessage(el, e);
        
        let displayHtml = '';
        if (infType !== 'none') {
            displayHtml = formatInfiniteSet(el, infType);
        } else {
            displayHtml = formatSetWithType(el, e);
        }
        
        let statusHtml = '';
        if (statusMsg) {
            statusHtml = `<p style="color:#856404;background:#fff3cd;padding:10px;border-radius:8px;margin-top:10px;"><strong>${statusMsg}</strong></p>`;
        }
        
        lp.innerHTML = `
            <p><strong>عناصر:</strong> ${displayHtml}</p>
            <p><strong>تعداد:</strong> ${el.length}</p>
            ${statusHtml}
        `;
        pc.style.display='block';
    } catch(err) {
        lp.innerHTML = `<p style="color:var(--danger-color);">${err.message}</p>`;
        pc.style.display='block';
    } 
}

// به روز رسانی تابع createSymbolicSet
function createSymbolicSet(){
    const n = document.getElementById('setName').value.trim();
    const e = document.getElementById('symbolicExpression').value.trim();
    if(!n||!e){showMessage('فیلدها را پر کنید','error');return;}
    if(AppState.sets.has(n)){showMessage(`"${n}" تکراری`,'warning');return;}
    try{
        let el = parseSymbolicExpression(e);
        const infType = getInfinityTypeForDisplay(el, e);
        const statusMsg = getSetStatusMessage(el, e);
        const isInf = infType !== 'none';
        
        AppState.sets.set(n, {
            type: 'symbolic',
            elements: el,
            expression: e,
            isInfinite: isInf,
            infinityType: infType,
            statusMessage: statusMsg,
            createdAt: new Date().toISOString()
        });
        HistoryManager.pushState(HistoryManager.getCurrentStateForHistory());
        StorageManager.saveState();
        updateStats();
        
        let displayMsg = `✅ "${n}" ایجاد شد: `;
        if (isInf) {
            displayMsg += formatInfiniteSet(el, infType);
        } else {
            displayMsg += formatSetWithType(el, e);
        }
        if (statusMsg) {
            displayMsg += `\n${statusMsg}`;
        }
        showMessage(displayMsg, isInf ? 'warning' : 'success', 6000);
        showAllSets();
    } catch(err){showMessage(`❌ ${err.message}`,'error');}
}

// به روز رسانی تابع showAllSets برای نمایش وضعیت مجموعه
function showAllSets() { 
    if(AppState.sets.size===0){
        document.getElementById("step").innerHTML=`<div class="step-container"><h3>مجموعه‌های موجود</h3><p>هنوز هیچ مجموعه‌ای ایجاد نشده است.</p><div class="quick-actions"><button onclick="quickCreateSet('اعداد فرد ۱ تا ۹',[1,3,5,7,9])" class="btn btn-info">اعداد فرد ۱-۹</button><button onclick="quickCreateSet('اعداد زوج ۲ تا ۱۰',[2,4,6,8,10])" class="btn btn-info">اعداد زوج ۲-۱۰</button><button onclick="quickCreateSet('اعداد -۲ تا ۲',[-2,-1,0,1,2])" class="btn btn-info">اعداد -۲ تا ۲</button></div><div class="button-group"><button onclick="addNewSet()" class="btn btn-primary">➕ ایجاد مجموعه جدید</button><button onclick="showMainMenu()" class="btn btn-secondary">🔙 بازگشت به منوی اصلی</button></div></div>`;
        return;
    } 
    let h='<div class="step-container"><h3>مجموعه‌های موجود</h3>'; 
    h+=`<p>تعداد مجموعه‌ها: <strong>${AppState.sets.size}</strong></p>`; 
    AppState.sets.forEach((d,n)=>{
        const e=d.elements||[]; 
        let c=''; 
        let infType = d.infinityType || 'none';
        let statusMsg = d.statusMessage || '';
        
        if(d.type==='symbolic'){
            const dis = (infType !== 'none') ? 
                formatInfiniteSet(e, infType) + '<br><small style="color:#856404;">' + (statusMsg || '⚠️ مجموعه نامتناهی است') + '</small>' : 
                formatSetWithType(e, d.expression);
            c=`<div class="set-expression">${d.expression}</div><div class="set-content">مقادیر: ${dis}</div>`;
        } else if(d.type==='verbal'){
            const dis = (infType !== 'none') ? 
                formatInfiniteSet(e, infType) + '<br><small style="color:#856404;">' + (statusMsg || '⚠️ مجموعه نامتناهی است') + '</small>' : 
                formatSet(e);
            c=`<div class="set-description">${d.description}</div><div class="set-content">${dis}</div>`;
        } else {
            c=`<div class="set-content">${formatSet(e)}</div>`;
        }
        h+=`<div class="set-item"><div class="set-name">${n} <small>(${getTypeName(d.type)})</small></div>${c}<div class="set-actions"><button onclick="editSet('${n}')" class="btn btn-info">✏️ ویرایش</button><button onclick="deleteSet('${n}')" class="btn btn-danger">🗑️ حذف</button><button onclick="showSetDetails('${n}')" class="btn btn-secondary">📊 جزئیات</button></div></div>`;
    }); 
    h+='<div class="button-group"><button onclick="addNewSet()" class="btn btn-success">➕ مجموعه جدید</button><button onclick="showMainMenu()" class="btn btn-primary">🏠 منوی اصلی</button></div></div>'; 
    document.getElementById("step").innerHTML=h; 
}

// به روز رسانی تابع showSetDetails
function showSetDetails(n){
    const d=AppState.sets.get(n);
    if(!d)return;
    let iw='';
    if(AppState.infiniteSetsInfo && AppState.infiniteSetsInfo[n]) {
        iw=`<p style="color:#856404;background:#fff3cd;padding:10px;border-radius:8px;margin:12px 0;">${AppState.infiniteSetsInfo[n]}</p>`;
    }
    
    let infType = d.infinityType || 'none';
    let statusMsg = d.statusMessage || '';
    let elDisplay = '';
    
    if (infType !== 'none') {
        elDisplay = formatInfiniteSet(d.elements, infType) + 
                    '<br><small style="color:#856404;">' + (statusMsg || '⚠️ مجموعه نامتناهی است') + '</small>';
    } else {
        elDisplay = formatSet(d.elements);
        if (statusMsg) {
            elDisplay += '<br><small style="color:#856404;">' + statusMsg + '</small>';
        }
    }
    
    document.getElementById("step").innerHTML=`<div class="step-container"><h3>📊 ${n}</h3><div class="set-details"><p><strong>نوع:</strong> ${getTypeName(d.type)}</p><p><strong>تعداد:</strong> ${d.elements.length}</p><p><strong>اعضا:</strong> ${elDisplay}</p>${d.expression?`<p><strong>نمادین:</strong> ${d.expression}</p>`:''}${d.description?`<p><strong>توصیف:</strong> ${d.description}</p>`:''}${d.operation?`<p><strong>عملیات:</strong> ${d.operation}</p>`:''}${iw}<p><strong>زمان:</strong> ${new Date(d.createdAt).toLocaleString('fa-IR')}</p></div><button onclick="showAllSets()" class="btn btn-secondary">🔙</button></div>`;
}

// ... (بقیه کد مثل قبل) ...