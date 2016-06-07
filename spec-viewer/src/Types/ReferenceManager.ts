export class ReferenceManager {
	
	public register(name: string) {
		
	}
	
	public getId(name: string) {
		return name.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
	}
}
