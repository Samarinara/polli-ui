import {readFile} from 'node:fs/promises';
const token=process.env.POLLI_APP_UPDATE_TOKEN;
if(!token)throw new Error('Set POLLI_APP_UPDATE_TOKEN with contents:write access to enrolled app repositories.');
const repos=process.env.POLLI_APP_REPOSITORIES.split(',').map(x=>x.trim()).filter(Boolean);
const {version}=JSON.parse(await readFile('packages/ui/package.json','utf8'));
for(const repo of repos){
 if(!/^[\w.-]+\/[\w.-]+$/.test(repo))throw new Error('Use comma-separated owner/repo names.');
 const response=await fetch(`https://api.github.com/repos/${repo}/dispatches`,{method:'POST',headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'},body:JSON.stringify({event_type:'polli-ui-released',client_payload:{version}})});
 if(!response.ok)throw new Error(`App notification failed for ${repo}: HTTP ${response.status}`);
 console.log(`Notified ${repo} about ${version}`);
}
