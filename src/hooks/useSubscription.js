import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { PLANS } from '../lib/entitlements';

const STORAGE_KEY = 'navora_subscription_v1';

function loadLocal(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw) return JSON.parse(raw);
  }catch{}
  return null;
}
function saveLocal(v){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(v)); }catch{}
}

// local AI usage counter per day
function todayKey(){ return new Date().toISOString().slice(0,10); }
export function getAiUsage(){
  try{
    const raw = localStorage.getItem('navora_ai_usage');
    const data = raw ? JSON.parse(raw) : {};
    const k = todayKey();
    return data[k] || 0;
  }catch{return 0;}
}
export function incAiUsage(){
  try{
    const raw = localStorage.getItem('navora_ai_usage');
    const data = raw ? JSON.parse(raw) : {};
    const k = todayKey();
    data[k] = (data[k]||0)+1;
    // keep only last 7 days
    const keys = Object.keys(data).sort().slice(-7);
    const trimmed = {}; keys.forEach(k=>trimmed[k]=data[k]);
    localStorage.setItem('navora_ai_usage', JSON.stringify(trimmed));
    return data[k];
  }catch{return 0;}
}

export function useSubscription(){
  const [sub, setSub] = useState(()=>{
    const local = loadLocal();
    if(local && local.expires_at && new Date(local.expires_at) < new Date()){
      return { plan:'free', status:'expired', ...local };
    }
    return local || { plan:'free', status:'active', billing_provider:null };
  });

  const fetchRemote = useCallback(async()=>{
    try{
      const { data:{ user } } = await supabase.auth.getUser();
      if(!user) return;
      const { data } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).maybeSingle();
      if(data){
        const effective = data.expires_at && new Date(data.expires_at) < new Date() ? { ...data, plan:'free', status:'expired' } : data;
        setSub(effective);
        saveLocal(effective);
      }
    }catch{}
  },[]);

  useEffect(()=>{ fetchRemote(); },[fetchRemote]);

  const isPro = sub.plan==='pro' && sub.status==='active' && (!sub.expires_at || new Date(sub.expires_at) > new Date());
  const plan = isPro ? PLANS.pro : PLANS.free;

  // server verification helper
  const verifyFeature = useCallback(async(feature)=>{
    try{
      const res = await fetch('/api/entitlement/check', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ feature })
      });
      const j = await res.json();
      return j.allowed === true;
    }catch{ return isPro; }
  },[isPro]);

  return { sub, plan, isPro, fetchRemote, verifyFeature, aiUsed: getAiUsage() };
}
