// upload resume and store in supabase

import { supabase } from "../config/supabase.js";

export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please provide a valid resume' })
        }
        const file = req.file
        const fileName = `${Date.now()}-${file.originalname}`
        const { data, error } = await supabase.storage.from('Resumyzer').upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        })
        if (error) throw error;
        return res.json({
            success: true,
            path: data.path
        })
    } catch (error) {
        console.error('Error while uploading Resume File', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}