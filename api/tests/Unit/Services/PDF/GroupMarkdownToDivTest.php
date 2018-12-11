<?php

namespace Tests\Unit\Services\PDF;

use App\Services\PDF\GroupMarkdownToDiv;

class GroupMarkdownToDivTest extends \TestCase
{
    public function testGroupWithNormalMarkdown()
    {
        $parser = new \Parsedown();
        $template = "# This is a title\nWe discuss about things here";
        $result = "<div><div><h1>This is a title</h1><p>We discuss about things here</p></div></div>\n";
        $this->assertEquals($result, GroupMarkdownToDiv::group($parser->text($template)));
    }

    public function testMarkdownEndsWithTitle()
    {
        $parser = new \Parsedown();
        $template = "# This is a title\nblob\n# End Note";
        $resultLine1 = "<div><div><h1>This is a title</h1><p>blob</p></div>";
        $resultLine2 = "<div><h1>End Note</h1></div></div>\n";

        $this->assertStringStartsWith($resultLine1, GroupMarkdownToDiv::group($parser->text($template)));
        $this->assertStringEndsWith($resultLine2, GroupMarkdownToDiv::group($parser->text($template)));
    }
}
