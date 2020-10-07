
export default class Likes{
    constructor(){
        this.likes = [];
    }

    addLikes(id, title, author, img){
        const like = {id, title, author, img};
        if( this.isLiked(id)){
            this.likes.push(like);
            return like;
        }
    }

    deleteItem(id){
        const index = this.likes.findIndex(el=>el.id === id);
        this.likes.splice(index,1); 
    }

    isLiked(id){
        if(this.likes.findIndex(el => el.id===id ) !== -1){
            return true;
        }
        return false;
    }

    getNumLikes(){
        return this.likes.length;
    }
}