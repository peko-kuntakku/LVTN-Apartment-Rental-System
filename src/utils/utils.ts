import { storage } from "../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";

export function transformMetaData(resMeta: any) {
   return resMeta.pagination.total
}

export let currencyFormatter = new Intl.NumberFormat('vi-VN');

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const handleSubmitImg = async (file: any, folder: string) => {
   // e.preventDefault()
   if (!file) return;
   const storageRef = ref(storage, `${folder}/${file.name}`);
   const uploadTask = uploadBytesResumable(storageRef, file);
   /*
       Make other tasks wait for handleSubmitImg
   */
   return new Promise((resolve, reject) => {
      uploadTask.on("state_changed",
         (snapshot) => {
            const progress =
               Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
         },
         (error) => {
            toast.error('Lỗi lưu ảnh.');
            reject(error);
         },
         () => {
            /*
                return url instead of setState
            */
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
               // setSaveImgUrl(downloadURL); 
               resolve(downloadURL);
               return downloadURL;
            });
         }
      );
   })
}

export function getField(Obj: string | undefined) {
   if (!Obj) return '';
   const arr = Obj.split('-');
   return arr;
}

export function roundCoorNumber(coor: number) {
   return Math.round(coor * 100000) / 100000;
}