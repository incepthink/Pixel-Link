import { NextFetchEvent, NextRequest, NextResponse } from "next/server";



export function middleware(req, res) {
  if (req.cookies.jwt) {
    // console.log(req.cookies.user);

    const user = JSON.parse(req.cookies.user);

    console.log("user admin",user)

    if (user.admin) {
      console.log("next")
      NextResponse.next();
    } else {
      console.log("nonono")
      NextResponse.redirect("/");
    }
  } else {
    console.log("no cookie");
    NextResponse.redirect("/");
  }
}
