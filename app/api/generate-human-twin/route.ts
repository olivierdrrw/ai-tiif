import {
 NextResponse
}
from "next/server";

export async function POST(){

 return NextResponse.json({

  identityScore:75,

  wellbeingScore:80,

  growthScore:71,

  impactScore:68,

 });

} 