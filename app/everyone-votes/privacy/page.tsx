export default function Privacy() {
  return (
    <main className="ml-[10%] mt-[5%] mr-[10%]">
      <h1 className="text-3xl">Everyone Votes Privacy Policy</h1>
      <p>Everyone Votes is an application on Discord that delivers and tallies daily polls to Discord servers. By being a user, you agree to the following use of your data:</p>

      <br/>

      <h2 className="text-2xl">What We Store</h2>

      <h3 className="text-xl">By voting on a poll with Everyone Votes, we store:</h3>
      <ul>
        <p>- The poll option(s) you voted on</p>
        <p>- Your Discord user id</p>
      </ul>
      <p>This data is stored for up to 24 hours, and is wiped every day at UTC midnight.</p>
      <p>A cumulative count of the number of votes for each poll option is saved indefinitely.</p>

      <br/>

      <h3 className="text-xl">By setting up Everyone Votes, we store:</h3>
      <ul>
        <p>- The server id, poll channel ids, and current poll messages</p>
        <p>- Config settings</p>
      </ul>
      <p>This data is stored for as long as Everyone Votes is setup within the server.</p>

      <br/>

      <h3 className="text-xl">By adding server-wide polls on Everyone Votes, we store:</h3>
      <ul>
        <p>- All of those polls&apos; data</p>
      </ul>
      <p>This data is stored up until the results are tallied for it. Moderators can also manually remove the poll by using the corresponding command.</p>

      <br/>

      <p>In summary, I don&apos;t use your data for anything malicious, just for getting poll result counts.</p>

      <br/>

      <h2 className="text-2xl">Removal of Data</h2>
      <p>Server data is erased once Everyone Votes is kicked from the server. Any server moderator can kick the bot to trigger this erasure.</p>
      <p>User vote data is erased at UTC midnight every day. Since user vote data lasts such a small window of time, erasure requests cannot be fulfilled for this data.</p>

      <br/>

      <h2 className="text-2xl">Contact</h2>
      <p>If you have questions or concerns about these terms, please join the <a href="https://discord.gg/pc6EcNjuZU" className="text-blue-500">support server</a> on Discord, or email <span className="font-mono">contact@sukadia.dev</span>.</p>
    </main>
  )
}