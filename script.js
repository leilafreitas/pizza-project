const qs=(el)=>{
    return document.querySelector(el);
}
const qsall=(element)=>{
    return document.querySelectorAll(element);
}
let modalQT = 1;
let chave=null;
let cart=[];
//Listagem das pizzas
pizzaJson.map((item,index)=>{
    modalQT = 1;
    let pizzaItem = qs('.models .pizza-item').cloneNode(true);
    //preencher as informações em pizzaItem
    pizzaItem.querySelector('.pizza-item--img img').src= item.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML=item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML=item.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML=`R$ ${item.price[2].toFixed(2)}`;
    pizzaItem.querySelector('a').addEventListener('click',(event)=>{
        //bloquear a ação de atualizar a tela
        modalQT = 1;
        event.preventDefault();
        /**o .target pega a referência ao objeto que enviou o evento que no caso seria o '.pizza-item a', já o .closet(), pega o ancestral mais próximo baseado na referência dada, que no exemplo seria o '.pizza-item'. */
        //Para usar em outras funções
        chave=index;
        qs('.pizzaBig img').src=item.img;
        qs('.pizzaInfo h1').innerHTML=item.name;
        qs('.pizzaInfo--desc').innerHTML=item.description;
        qs('.pizzaInfo--size.selected').classList.remove('selected');

        qsall('.pizzaInfo--size').forEach((size,index)=>{
            if(index==2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML=item.size[index];
        });
        qs('.pizzaInfo--qt').innerHTML=modalQT;
        let vet=qs('.pizzaInfo--size.selected').getAttribute('data-key');
        
        qs('.pizzaInfo--actualPrice').innerHTML=`R$ ${item.price[vet]}`
        qs('.pizzaWindowArea').style.opacity= 0;
        qs('.pizzaWindowArea').style.display= 'flex';
        setTimeout(()=>{
            qs('.pizzaWindowArea').style.opacity= 1;
        },200);
        
        
    })

    //Bota o append para apenas adicionar, sem sobrescrever
    qs('.pizza-area').append(pizzaItem);
});
//Eventos do Modal
function closeModal(){
    qs('.pizzaWindowArea').style.opacity= 0;
    setTimeout(()=>{
        qs('.pizzaWindowArea').style.display= 'none';
    },500);
}
qsall('.pizzaInfo--cancelButton , pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click',closeModal);
});
qs('.pizzaInfo--qtmais').addEventListener('click',()=>{
    modalQT++;
    qs('.pizzaInfo--qt').innerHTML=modalQT;

})
qs('.pizzaInfo--qtmenos').addEventListener('click',()=>{
    if(modalQT>1){
        modalQT--;
        qs('.pizzaInfo--qt').innerHTML=modalQT;
    }
})
qsall('.pizzaInfo--size').forEach((size,index)=>{
    size.addEventListener('click',(e)=>{
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
        let vet = qs('.pizzaInfo--size.selected').getAttribute('data-key'); 
        qs('.pizzaInfo--actualPrice').innerHTML=`R$ ${pizzaJson[chave].price[vet]}`
    });
});
//Funções para manuseio do carrinho de compras
qs('.pizzaInfo--addButton').addEventListener('click',()=>{
    //Nome da pizza, tamanho e quantidade 
    //nome--já tem acesso
    //quantidade--já tem acesso
    //tamanho
    let size = parseInt(qs('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier=pizzaJson[chave].id+'@'+size;
    let key= cart.findIndex((item)=>{
        return item.identifier == identifier;
    });
    if(key > -1){
        cart[key].qt+=modalQT;
    }else{
        cart.push({
            id:pizzaJson[chave].id,
            size,
            qt:modalQT,
            identifier
        })
    }
    updateCart();
    closeModal();
});

function updateCart(){
    qs('.menu-openner span').innerHTML=cart.length;
    if(cart.length > 0){
        qs('aside').classList.add('show');
        qs('.cart').innerHTML='';
        let subtotal=0;
        let desconto=0;
        let total=0;
        for (i of cart){
            let pizzaItem = pizzaJson.find((item)=>{
                return item.id == i.id;
            });
            subtotal+= pizzaItem.price[i.size] * i.qt;
            let cartItem =qs('.models .cart--item').cloneNode(true);
            let pizzaSize;

            if(i.size == 0){
                pizzaSize='P';
            }else if (i.size == 1){
                pizzaSize='M';
            }else{
                pizzaSize='G';
            }
            cartItem.querySelector('img').src=pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML=`${pizzaItem.name} (${pizzaSize})`;
            cartItem.querySelector('.cart--item--qt').innerHTML=i.qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(i.qt>1){
                    i.qt=i.qt-1;
                } else{
                    cart.splice(cart.indexOf(i),1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                i.qt++;
                updateCart();
            });
            qs('.cart').append(cartItem);
        }
        desconto = subtotal * 0.1;
        total=subtotal-desconto;
        qs('.subtotal span:last-child').innerHTML=`R$ ${subtotal.toFixed(2)}`;
        qs('.desconto span:last-child').innerHTML=`R$ ${desconto.toFixed(2)}`;
        qs('.total span:last-child').innerHTML=`R$ ${total.toFixed(2)}`;

    }else{
        qs('aside').classList.remove('show');
        qs('aside').style.left='100vw';
    }
}
qs('.menu-openner').addEventListener('click',()=>{
    if(cart.length>0){
        qs('aside').style.left='0';
    }
});
qs('.menu-closer').addEventListener('click',()=>{
    qs('aside').style.left='100vw';
});

